import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  id?: string;
  disabled?: (date: Date) => boolean;
}

export function DatePicker({ value, onChange, placeholder = 'dd/mm/aaaa', id, disabled }: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date);
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
          <CalendarIcon className="mr-2 size-4 text-slate-400" />
          {value ? format(value, 'dd/MM/yyyy', { locale: es }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          locale={es}
          initialFocus
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
