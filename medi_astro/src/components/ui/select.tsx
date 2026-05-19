import * as React from 'react';
import { cn } from '@/lib/utils';

export type SelectOption = { value: string; label: string; disabled?: boolean };

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 text-[15px] text-foreground',
        'transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#464BD8]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} disabled={opt.disabled} className={opt.disabled ? "text-slate-400" : ""}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
);

Select.displayName = 'Select';
