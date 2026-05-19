import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { Select, type SelectOption } from '@/components/ui/select';
import { agendaService } from '@/services/agenda.service';

export function EditShiftModal({ doctor, onClose }: { doctor: any, onClose: () => void }) {
  const [loading, setLoading] = React.useState(true);
  const [shiftId, setShiftId] = React.useState<number | null>(null);
  
  // Form state
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [startTime, setStartTime] = React.useState('08:00');
  const [endTime, setEndTime] = React.useState('17:00');
  const [roomId, setRoomId] = React.useState('');
  const [rooms, setRooms] = React.useState<SelectOption[]>([]);

  React.useEffect(() => {
    if (!doctor) return;

    async function loadData() {
      const { data: roomsData } = await agendaService.getRooms();
      if (roomsData) {
        setRooms(roomsData.map(r => ({ value: String(r.id), label: r.name })));
      }

      // Buscar el último turno activo del médico
      const { data: schedules } = await agendaService.getSchedulesByDate(new Date().toISOString().split('T')[0]); // Esto es un hack temporal, mejor buscar por doctor_id
      // Como agendaService no tiene getSchedulesByDoctor, usaremos supabase directo aquí para rápido
      const { supabase } = await import('@/lib/supabase');
      const { data: doctorShifts } = await supabase
        .from('doctor_schedules')
        .select('*')
        .eq('doctor_id', doctor.id)
        .order('start_date', { ascending: false })
        .limit(1);

      if (doctorShifts && doctorShifts.length > 0) {
        const shift = doctorShifts[0];
        setShiftId(shift.id);
        const [y, m, d] = shift.start_date.split('-');
        setStartDate(new Date(y, m - 1, d));
        setStartTime(shift.start_time.substring(0, 5));
        setEndTime(shift.end_time.substring(0, 5));
        setRoomId(String(shift.room_id));
      }
      
      setLoading(false);
    }
    
    loadData();
  }, [doctor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !roomId || !shiftId) return;

    const startStr = startDate.toISOString().split('T')[0];
    const { supabase } = await import('@/lib/supabase');
    
    const { error } = await supabase
      .from('doctor_schedules')
      .update({
        start_date: startStr,
        end_date: startStr, // Asumimos un día por ahora
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        room_id: roomId
      })
      .eq('id', shiftId);

    if (error) {
      alert(`Error al actualizar turno: ${error.message}`);
    } else {
      alert('Turno actualizado con éxito');
      window.location.reload();
    }
  };

  return (
    <Dialog open={!!doctor} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Editar Turno de {doctor?.name}</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <p className="py-4 text-center text-slate-500">Cargando turno actual...</p>
        ) : !shiftId ? (
          <p className="py-4 text-center text-slate-500">Este médico no tiene turnos activos para editar.</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Consultorio</label>
              <Select 
                id="room" 
                placeholder="Seleccionar Consultorio" 
                options={rooms}
                value={roomId} 
                onChange={(e) => setRoomId(e.target.value)} 
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Fecha del Turno</label>
              <DatePicker 
                value={startDate} 
                onChange={setStartDate} 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Hora Inicio</label>
                <TimePicker value={startTime} onChange={setStartTime} />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700">Hora Fin</label>
                <TimePicker value={endTime} onChange={setEndTime} />
              </div>
            </div>
            
            <Button type="submit" className="mt-4 w-full bg-[#464BD8] hover:bg-[#3D41BC]">
              Actualizar Turno
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
