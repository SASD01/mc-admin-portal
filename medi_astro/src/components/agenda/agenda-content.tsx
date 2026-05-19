import { ShiftForm } from './shift-form';
import { AvailableRooms } from './available-rooms';
import { useAgendaData } from '@/hooks/use-agenda-data';

/**
 * Agenda content orchestrator — composes ShiftForm + AvailableRooms
 * and injects backend data via the useAgendaData hook.
 */
export function AgendaContent() {
  const {
    specialties, doctors, offices, slots,
    handleSpecialtyChange, handleSubmit,
  } = useAgendaData();

  return (
    <div className="space-y-3">
      <ShiftForm
        specialties={specialties}
        doctors={doctors}
        offices={offices}
        onSubmit={handleSubmit}
        onSpecialtyChange={handleSpecialtyChange}
      />
      <AvailableRooms slots={slots} />
    </div>
  );
}
