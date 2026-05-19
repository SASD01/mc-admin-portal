import * as React from 'react';
import type { SelectOption } from '@/components/ui/select';
import type { ShiftPayload, AvailableSlot } from '@/types/agenda';
import { agendaService } from '@/services/agenda.service';

export function useAgendaData() {
  const [specialties, setSpecialties] = React.useState<SelectOption[]>([]);
  const [allDoctors, setAllDoctors] = React.useState<any[]>([]);
  const [doctors, setDoctors] = React.useState<SelectOption[]>([]);
  const [offices, setOffices] = React.useState<SelectOption[]>([]);
  const [slots, setSlots] = React.useState<AvailableSlot[] | undefined>();

  const specialtyMapRef = React.useRef<Map<string, number>>(new Map());

  React.useEffect(() => {
    async function loadData() {
      const [doctorsRes, roomsRes] = await Promise.all([
        agendaService.getDoctors(),
        agendaService.getRooms()
      ]);

      if (doctorsRes.error) console.error('Error al obtener médicos:', doctorsRes.error.message);
      if (roomsRes.error) console.error('Error al obtener consultorios:', roomsRes.error.message);

      if (roomsRes.data) {
        setOffices(roomsRes.data.map((room) => ({ value: String(room.id), label: room.name })));
      }

      if (doctorsRes.data) {
        setAllDoctors(doctorsRes.data);
        const uniqueSpecialties = Array.from(new Set(doctorsRes.data.map(d => d.speciality))).filter(Boolean) as string[];
        const newMap = new Map<string, number>();
        uniqueSpecialties.forEach((s, index) => newMap.set(s, index + 1));
        specialtyMapRef.current = newMap;
        
        setSpecialties(uniqueSpecialties.map((s) => ({ value: String(newMap.get(s)), label: s })));
        
        setDoctors(doctorsRes.data.map(d => ({
          value: String(d.id),
          label: `Dr. ${d.first_name} ${d.last_name} - ${d.speciality} ${d.status === 'on_leave' ? '(En Licencia)' : ''}`,
          disabled: d.status === 'on_leave'
        })));
      }
    }
    
    loadData();
    const today = new Date().toISOString().split('T')[0];
    loadSlots(today);
  }, []);

  const handleSpecialtyChange = async (id: number) => {
    const specialtyName = [...specialtyMapRef.current.entries()].find(([k, v]) => v === id)?.[0];
    
    if (specialtyName) {
      const filtered = allDoctors.filter(d => d.speciality === specialtyName);
      setDoctors(filtered.map(d => ({
        value: String(d.id),
        label: `Dr. ${d.first_name} ${d.last_name} ${d.status === 'on_leave' ? '(En Licencia)' : ''}`,
        disabled: d.status === 'on_leave'
      })));
    } else {
      setDoctors(allDoctors.map(d => ({
        value: String(d.id),
        label: `Dr. ${d.first_name} ${d.last_name} - ${d.speciality} ${d.status === 'on_leave' ? '(En Licencia)' : ''}`,
        disabled: d.status === 'on_leave'
      })));
    }
  };

  const handleSubmit = async (payload: ShiftPayload) => {
    const now = new Date();
    const [startYear, startMonth, startDay] = payload.startDate.split('-');
    const [startHour, startMinute] = payload.startTime.split(':');
    const shiftStart = new Date(Number(startYear), Number(startMonth) - 1, Number(startDay), Number(startHour), Number(startMinute));
    
    if (shiftStart < now) {
      alert('Error: No puedes agendar un turno en una fecha u hora que ya pasó.');
      return;
    }

    const { data: overlappingShifts, error: checkError } = await agendaService.checkOverlaps(
      payload.officeId, payload.startDate, payload.startTime, payload.endTime
    );

    if (checkError) {
      alert(`Error al verificar disponibilidad: ${checkError.message}`);
      return;
    }

    if (overlappingShifts && overlappingShifts.length > 0) {
      alert('Error: El consultorio seleccionado ya se encuentra ocupado en ese rango de horario.');
      return;
    }

    const { error } = await agendaService.insertShift(payload);

    if (error) {
      alert(`Error al guardar el turno: ${error.message}`);
      return;
    }

    alert('Turno guardado con éxito!');
    if (payload.startDate) {
      await loadSlots(payload.startDate);
    }
  };

  const loadSlots = async (date: string) => {
    if (!date) return;
    const [roomsRes, schedulesRes] = await Promise.all([
      agendaService.getRooms(),
      agendaService.getSchedulesByDate(date)
    ]);

    if (roomsRes.error || schedulesRes.error) return;

    const now = new Date();
    const isToday = date === now.toISOString().split('T')[0];
    const currentHourMin = now.toTimeString().substring(0, 5);

    const computedSlots: AvailableSlot[] = (roomsRes.data || []).map(room => {
      const activeSchedules = (schedulesRes.data || []).filter(s => {
        if (!isToday) return true;
        return s.end_time.substring(0, 5) > currentHourMin;
      });

      const assigned = activeSchedules.find(s => String(s.room_id) === String(room.id));
      if (assigned) {
        return {
          officeId: room.id,
          officeName: room.name,
          timeRange: `${assigned.start_time.substring(0, 5)} - ${assigned.end_time.substring(0, 5)}`,
          status: 'assigned'
        };
      }
      return {
        officeId: room.id,
        officeName: room.name,
        timeRange: 'Disponible',
        status: 'available'
      };
    });

    setSlots(computedSlots);
  };

  return { specialties, doctors, offices, slots, handleSpecialtyChange, handleSubmit, loadSlots };
}
