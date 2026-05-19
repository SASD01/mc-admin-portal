import { supabase } from '@/lib/supabase';
import type { ShiftPayload } from '@/types/agenda';

export const agendaService = {
  getDoctors: async () => {
    return supabase
      .from('doctors')
      .select('id, first_name, last_name, speciality, status, license_number')
      .order('first_name', { ascending: true });
  },

  getRooms: async () => {
    return supabase
      .from('rooms')
      .select('id, name')
      .eq('is_active', true)
      .order('name', { ascending: true });
  },

  checkOverlaps: async (roomId: string | number, startDate: string, startTime: string, endTime: string) => {
    return supabase
      .from('doctor_schedules')
      .select('id')
      .eq('room_id', roomId)
      .eq('start_date', startDate)
      .lt('start_time', endTime)
      .gt('end_time', startTime);
  },

  insertShift: async (payload: ShiftPayload) => {
    return supabase.from('doctor_schedules').insert({
      doctor_id: payload.doctorId,
      room_id: payload.officeId,
      start_date: payload.startDate,
      end_date: payload.endDate,
      start_time: payload.startTime,
      end_time: payload.endTime,
    });
  },

  getSchedulesByDate: async (date: string) => {
    // Limpieza en tiempo real antes de consultar (como solicitó el usuario Senior)
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().substring(0, 8);
    
    // 1. Limpiar días anteriores
    await supabase.from('doctor_schedules').delete().lt('start_date', today);
    // 2. Limpiar turnos de hoy que ya pasaron
    await supabase.from('doctor_schedules').delete().eq('start_date', today).lt('end_time', nowTime);

    return supabase
      .from('doctor_schedules')
      .select('room_id, start_time, end_time')
      .eq('start_date', date);
  },
  
  getRecentShifts: async (limit: number = 3) => {
    // Solo mostrar turnos que hayan sido creados en las últimas 24 horas
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString();
    
    return supabase
      .from('doctor_schedules')
      .select(`
        id,
        start_date,
        start_time,
        end_time,
        created_at,
        doctors ( first_name, last_name, speciality )
      `)
      .gte('created_at', yesterdayStr)
      .order('created_at', { ascending: false })
      .limit(limit);
  },
  
  getStaffWithSchedules: async () => {
    // Limpiar base de datos en tiempo real de turnos pasados
    const today = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toTimeString().substring(0, 8);
    await supabase.from('doctor_schedules').delete().lt('start_date', today);
    await supabase.from('doctor_schedules').delete().eq('start_date', today).lt('end_time', nowTime);

    // Para evitar errores de Foreign Key no detectados en PostgREST (Supabase),
    // hacemos dos consultas y las cruzamos manualmente.
    const [doctorsRes, schedulesRes] = await Promise.all([
      supabase
        .from('doctors')
        .select('id, first_name, last_name, speciality, status, license_number')
        .order('first_name', { ascending: true }),
      supabase
        .from('doctor_schedules')
        .select('doctor_id, start_date, start_time, end_time')
    ]);

    if (doctorsRes.error) return { data: null, error: doctorsRes.error };

    const data = doctorsRes.data.map((doc: any) => {
      const shifts = schedulesRes.data?.filter((s: any) => String(s.doctor_id) === String(doc.id)) || [];
      return {
        ...doc,
        doctor_schedules: shifts
      };
    });

    return { data, error: null };
  },

  setDoctorLeave: async (doctorId: string, startDate: string, endDate: string) => {
    // 1. Limpiar todos los turnos del médico en ese rango de fechas
    await supabase
      .from('doctor_schedules')
      .delete()
      .eq('doctor_id', doctorId)
      .gte('start_date', startDate)
      .lte('start_date', endDate);

    // 2. Actualizar el estado del médico a en licencia
    const res = await supabase
      .from('doctors')
      .update({ status: 'on_leave' })
      .eq('id', doctorId)
      .select();
      
    // Si res.data es vacío, significa que RLS en Supabase impidió el UPDATE o el ID no se encontró.
    if (!res.error && res.data && res.data.length === 0) {
      return { error: { message: "El estado no se actualizó porque las políticas de seguridad (RLS) en la tabla 'doctors' bloquean la edición, o el ID es inválido." } };
    }

    return res;
  }
};
