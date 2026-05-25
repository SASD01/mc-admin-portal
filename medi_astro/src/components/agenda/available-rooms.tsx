import type { AvailableSlot } from '@/types/agenda';

interface AvailableRoomsProps {
  slots?: AvailableSlot[];
}

function SlotRow({ slot }: { slot: AvailableSlot }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <div>
        <p className="text-[15px] font-semibold text-[#1E2330]">{slot.officeName}</p>
        <p className="mt-0.5 text-[14px] text-slate-500">{slot.timeRange}</p>
      </div>
      <span className="text-[14px] font-medium text-slate-500">
        {slot.status === 'available' ? 'Por Asignar' : 'Asignado'}
      </span>
    </div>
  );
}

export function AvailableRooms({ slots = [] }: AvailableRoomsProps) {
  return (
    <section className="mt-3 rounded-[18px] border border-slate-200 bg-white p-4">
      <h3 className="text-[20px] font-semibold text-[#1E2330]">Consultorios Disponibles</h3>
      <p className="mt-1 text-[13px] text-slate-500">
        Sugerencias para optimizar la ocupación de consultorios hoy.
      </p>
      <div className="mt-3 space-y-2">
        {slots.length > 0 ? (
          slots.map((slot) => <SlotRow key={slot.officeId} slot={slot} />)
        ) : (
          <p className="rounded-xl border border-dashed border-slate-200 py-6 text-center text-sm text-slate-400">
            Sin consultorios disponibles para hoy.
          </p>
        )}
      </div>
    </section>
  );
}
