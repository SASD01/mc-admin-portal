import { Clock } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value?: string;
  onChange?: (time: string) => void;
  placeholder?: string;
  id?: string;
}

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];

function formatDisplay(time: string) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
}

export function TimePicker({ value, onChange, placeholder = 'HH:MM', id }: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [period, setPeriod] = React.useState<'AM' | 'PM'>('AM');

  const handleSelect = (hour: string, minute: string) => {
    let h = Number(hour);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    onChange?.(`${String(h).padStart(2, '0')}:${minute}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            'h-11 w-full justify-start rounded-xl border-slate-200 bg-white px-4 text-left text-[15px] font-normal shadow-none hover:bg-slate-50',
            !value && 'text-slate-400',
          )}
        >
          <Clock className="mr-2 size-4 text-slate-400" />
          {value ? formatDisplay(value) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[240px] p-3" align="start">
        <div className="mb-2 flex justify-center gap-1">
          {(['AM', 'PM'] as const).map((p) => (
            <button key={p} type="button"
              className={cn(
                'rounded-lg px-4 py-1.5 text-[13px] font-medium transition-colors',
                period === p ? 'bg-[#464BD8] text-white' : 'text-slate-500 hover:bg-slate-100',
              )}
              onClick={() => setPeriod(p)}
            >{p}</button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <p className="mb-1 text-center text-[11px] font-medium uppercase text-slate-400">Hora</p>
            <div className="grid max-h-[180px] grid-cols-3 gap-1 overflow-y-auto">
              {HOURS.filter(h => !(period === 'AM' && (Number(h) < 6 || Number(h) === 12))).map((h) => (
                <button key={h} type="button"
                  className="rounded-lg py-1.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-[#EEF0FF] hover:text-[#464BD8]"
                  onClick={() => handleSelect(h, value?.split(':')[1] || '00')}
                >{h}</button>
              ))}
            </div>
          </div>
          <div className="w-[1px] bg-slate-200" />
          <div className="flex-1">
            <p className="mb-1 text-center text-[11px] font-medium uppercase text-slate-400">Min</p>
            <div className="grid grid-cols-2 gap-1">
              {MINUTES.map((m) => (
                <button key={m} type="button"
                  className="rounded-lg py-1.5 text-[14px] font-medium text-slate-700 transition-colors hover:bg-[#EEF0FF] hover:text-[#464BD8]"
                  onClick={() => handleSelect(value?.split(':')[0]?.replace(/^0/, '') || '12', m)}
                >{m}</button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
