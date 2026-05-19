import * as React from 'react';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DatePicker } from '@/components/ui/date-picker';
import { Select, type SelectOption } from '@/components/ui/select';
import { agendaService } from '@/services/agenda.service';

export function LeaveModal({ doctors }: { doctors: SelectOption[] }) {
  const [open, setOpen] = React.useState(false);
  const [doctorId, setDoctorId] = React.useState('');
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctorId || !startDate || !endDate) return;
    
    // Convertir fechas a string YYYY-MM-DD
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    
    const { error } = await agendaService.setDoctorLeave(doctorId, startStr, endStr);
    
    if (error) {
      alert(`Error al asignar licencia: ${error.message}`);
    } else {
      alert('Licencia asignada con éxito. El médico ahora aparece en licencia.');
      // En un entorno real se dispararía un reload de los datos aquí (ej. window.location.reload() o llamar a un callback)
      window.location.reload(); 
    }
    
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button 
          type="button"
          className="flex items-center gap-2 px-4 text-[14px] font-medium text-slate-600 transition-colors hover:text-slate-900"
        >
          <CalendarDays className="size-4" /> Licencia Médica
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Asignar Licencia Médica</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Médico</label>
            <Select 
              id="doctor" 
              placeholder="Seleccionar Médico..." 
              options={doctors}
              value={doctorId} 
              onChange={(e) => setDoctorId(e.target.value)} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Desde</label>
              <DatePicker 
                value={startDate} 
                onChange={setStartDate} 
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Hasta</label>
              <DatePicker 
                value={endDate} 
                onChange={setEndDate} 
                disabled={(date) => (startDate ? date < startDate : date < new Date(new Date().setHours(0, 0, 0, 0)))}
              />
            </div>
          </div>
          <Button type="submit" className="mt-4 w-full bg-[#464BD8] hover:bg-[#3D41BC]">
            Confirmar Licencia
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
