import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import * as React from 'react';

export function LiveClock() {
  const [now, setNow] = React.useState<Date>(new Date());

  React.useEffect(() => {
    // Actualizar el reloj cada segundo para tener la hora exacta
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right" suppressHydrationWarning>
      <h2 className="text-[22px] font-medium capitalize text-[#464BD8]" suppressHydrationWarning>
        {format(now, "EEEE, d 'de' MMMM yyyy", { locale: es })}
      </h2>
      <p className="mt-1 text-[15px] text-slate-500 uppercase tracking-wide" suppressHydrationWarning>
        {format(now, 'hh:mm:ss a')}
      </p>
    </div>
  );
}
