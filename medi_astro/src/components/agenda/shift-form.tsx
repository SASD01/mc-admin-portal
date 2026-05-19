import * as React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Select, type SelectOption } from '@/components/ui/select';
import { FormField } from '@/components/ui/form-field';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import type { ShiftPayload } from '@/types/agenda';

const EMPTY_FORM: ShiftPayload = {
  specialtyId: '', doctorId: '', officeId: '',
  startDate: '', endDate: '', startTime: '', endTime: '',
};

interface ShiftFormProps {
  specialties?: SelectOption[];
  doctors?: SelectOption[];
  offices?: SelectOption[];
  onSubmit?: (payload: ShiftPayload) => Promise<void>;
  onSpecialtyChange?: (id: number) => void;
}

export function ShiftForm({
  specialties = [], doctors = [], offices = [],
  onSubmit, onSpecialtyChange,
}: ShiftFormProps) {
  const [form, setForm] = React.useState<ShiftPayload>(EMPTY_FORM);
  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [endDate, setEndDate] = React.useState<Date | undefined>();
  const [loading, setLoading] = React.useState(false);

  const set = <K extends keyof ShiftPayload>(key: K, value: ShiftPayload[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSpecialty = (val: string) => {
    set('specialtyId', val);
    set('doctorId', '');
    // Si el hook de datos espera un id numérico de la especialidad, enviamos el Number o lo adaptamos
    onSpecialtyChange?.(Number(val));
  };

  const handleStartDate = (date: Date | undefined) => {
    setStartDate(date);
    set('startDate', date ? format(date, 'yyyy-MM-dd') : '');
  };

  const handleEndDate = (date: Date | undefined) => {
    setEndDate(date);
    set('endDate', date ? format(date, 'yyyy-MM-dd') : '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;
    setLoading(true);
    try { await onSubmit(form); }
    finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-[18px] border border-slate-200 bg-white p-5">
      <h2 className="text-[20px] font-semibold italic text-[#464BD8]">Nuevo Turno Rápido</h2>

      <div className="mt-3 space-y-2.5">
        <FormField label="Especialidad" htmlFor="specialty">
          <Select id="specialty" placeholder="Seleccionar Especialidad..." options={specialties}
            value={form.specialtyId || ''} onChange={(e) => handleSpecialty(e.target.value)} />
        </FormField>

        <FormField label="Médico" htmlFor="doctor">
          <Select id="doctor" placeholder="Seleccionar Médico..." options={doctors}
            value={form.doctorId || ''} onChange={(e) => set('doctorId', e.target.value)}
            disabled={!form.specialtyId} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Fecha Inicio" htmlFor="startDate">
            <DatePicker id="startDate" value={startDate} onChange={handleStartDate} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
          </FormField>
          <FormField label="Fecha Fin" htmlFor="endDate">
            <DatePicker id="endDate" value={endDate} onChange={handleEndDate} disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))} />
          </FormField>
        </div>

        <FormField label="Consultorio" htmlFor="office">
          <Select id="office" placeholder="Consultorio" options={offices}
            value={form.officeId || ''} onChange={(e) => set('officeId', e.target.value)} />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Hora de Inicio" htmlFor="startTime">
            <TimePicker id="startTime" value={form.startTime}
              onChange={(val) => set('startTime', val)} />
          </FormField>
          <FormField label="Hora de Fin" htmlFor="endTime">
            <TimePicker id="endTime" value={form.endTime}
              onChange={(val) => set('endTime', val)} />
          </FormField>
        </div>
      </div>

      <Button type="submit" disabled={loading}
        className="mt-4 h-10 w-full rounded-xl bg-[#464BD8] text-[15px] font-medium hover:bg-[#3D41BC]">
        {loading ? 'Guardando...' : 'Guardar Turno'}
      </Button>
    </form>
  );
}
