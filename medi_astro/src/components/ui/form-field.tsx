import * as React from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, htmlFor, children, className }: FormFieldProps) {
  return (
    <div className={className}>
      <Label htmlFor={htmlFor} className="mb-1 block text-[13px] font-medium text-slate-600">
        {label}
      </Label>
      {children}
    </div>
  );
}
