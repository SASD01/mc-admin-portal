import { supabase } from '@/lib/supabase';
import type { ShiftPayload } from '@/types/agenda';

export const agendaService = {
  getDoctors: () =>
    supabase
      .from('doctors')
      .select('id, first_name, last_name, speciality, status, license_number')
      .order('first_name', { ascending: true }),

  getRooms: () =>
    supabase
      .from('rooms')
      .select('id, name')
      .eq('is_active', true)
      .order('name', { ascending: true }),

  checkOverlaps: (roomId: string | number, startDate: string, startTime: string, endTime: string) =>
    supabase
      .from('doctor_schedules')
      .select('id')
      .eq('room_id', roomId)
      .eq('start_date', startDate)
      .lt('start_time', endTime)
      .gt('end_time', startTime),

  insertShift: (payload: ShiftPayload) =>
    supabase.from('doctor_schedules').insert({
      doctor_id: payload.doctorId,
      room_id: payload.officeId,
      start_date: payload.startDate,
      end_date: payload.endDate,
      start_time: payload.startTime,
      end_time: payload.endTime,
    }),

  /**
   * Limpieza de turnos vencidos — operación explícita, separada de las lecturas.
   * Llamar desde un cron o desde la UI con un botón explícito.
   */
  pruneExpiredShifts: async () => {
    const today = new Date().toISOString().split('T')[0]!;
    const nowTime = new Date().toTimeString().substring(0, 8);
    await supabase.from('doctor_schedules').delete().lt('start_date', today);
    await supabase.from('doctor_schedules').delete().eq('start_date', today).lt('end_time', nowTime);
  },

  getSchedulesByDate: (date: string) =>
    supabase
      .from('doctor_schedules')
      .select('room_id, start_time, end_time')
      .eq('start_date', date),

  getRecentShifts: (limit = 3) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return supabase
      .from('doctor_schedules')
      .select('id, start_date, start_time, end_time, created_at, doctors ( first_name, last_name, speciality )')
      .gte('created_at', yesterday.toISOString())
      .order('created_at', { ascending: false })
      .limit(limit);
  },

  getStaffWithSchedules: async () => {
    const [doctorsRes, schedulesRes] = await Promise.all([
      supabase
        .from('doctors')
        .select('id, first_name, last_name, speciality, status, license_number')
        .order('first_name', { ascending: true }),
      supabase
        .from('doctor_schedules')
        .select('doctor_id, start_date, start_time, end_time'),
    ]);

    if (doctorsRes.error) return { data: null, error: doctorsRes.error };

    const data = doctorsRes.data.map((doc) => ({
      ...doc,
      doctor_schedules: (schedulesRes.data ?? []).filter(
        (s) => String(s.doctor_id) === String(doc.id),
      ),
    }));

    return { data, error: null };
  },

  setDoctorLeave: async (doctorId: string, startDate: string, endDate: string) => {
    await supabase
      .from('doctor_schedules')
      .delete()
      .eq('doctor_id', doctorId)
      .gte('start_date', startDate)
      .lte('start_date', endDate);

    const res = await supabase
      .from('doctors')
      .update({ status: 'on_leave' })
      .eq('id', doctorId)
      .select();

    if (!res.error && res.data?.length === 0) {
      return { error: { message: 'RLS bloqueó el UPDATE o el ID es inválido.' } };
    }
    return res;
  },
};
