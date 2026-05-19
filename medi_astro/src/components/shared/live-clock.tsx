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
      <h2 className="text-lg font-medium capitalize text-[#464BD8] lg:text-[22px]" suppressHydrationWarning>
        {format(now, "EEEE, d 'de' MMMM yyyy", { locale: es })}
      </h2>
      <p className="mt-1 text-[13px] text-slate-500 uppercase tracking-wide lg:text-[15px]" suppressHydrationWarning>
        {format(now, 'hh:mm:ss a')}
      </p>
    </div>
  );
}
