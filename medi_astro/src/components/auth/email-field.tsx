import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function EmailField({ value, onChange }: EmailFieldProps) {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="email" className="text-white">
        Correo Electrónico
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="johndoe@email.com"
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
