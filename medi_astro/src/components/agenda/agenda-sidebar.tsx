import { es } from "date-fns/locale";
import { format } from "date-fns";
import { Clock as ClockIcon, Info } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { LiveClock } from "@/components/shared/live-clock";
import { agendaService } from "@/services/agenda.service";

export function AgendaSidebar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [recentShifts, setRecentShifts] = React.useState<any[]>([]);

  React.useEffect(() => {
    // Escuchar cambios no es estrictamente necesario si recargamos o solo mostramos al iniciar,
    // pero podemos hacer un fetch inicial.
    async function loadRecent() {
      const { data, error } = await agendaService.getRecentShifts(3);

      if (!error && data) {
        setRecentShifts(data);
      }
    }
    loadRecent();
  }, []);

  return (
    <aside className="flex flex-col gap-4">
      <LiveClock />

      <section className="rounded-[18px] border border-slate-200 bg-white p-5">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={es}
          className="w-full"
        />
      </section>

      <section>
        <h3 className="mb-3 text-[18px] font-semibold text-[#1E2330]">
          Actividad Reciente
        </h3>
        <div className="space-y-2">
          {recentShifts.length > 0 ? (
            recentShifts.map((shift) => (
              <article
                key={shift.id}
                className="flex items-start gap-3 rounded-[14px] border border-[#464BD8]/30 bg-[#464BD8]/5 px-4 py-3"
              >
                <Info className="mt-0.5 size-5.5 shrink-0 text-[#464BD8]" />
                <div className="space-y-0.5">
                  <p className="text-[15px] font-medium text-[#1E2330]">
                    Dr. {shift.doctors?.first_name} {shift.doctors?.last_name}
                  </p>
                  <p className="text-[13px] text-slate-500">
                    {shift.doctors?.speciality}
                  </p>
                  <p className="text-sm text-[#464BD8]">
                    {shift.start_date} | {shift.start_time.substring(0, 5)} -{" "}
                    {shift.end_time.substring(0, 5)}
                  </p>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-slate-200 p-4 text-center text-sm text-slate-500">
              No hay actividad reciente.
            </div>
          )}
        </div>
      </section>
    </aside>
  );
}
