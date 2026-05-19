import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PasswordFieldProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordField({ value, onChange }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  return (
    <div className="flex flex-col gap-2.5">
      <Label htmlFor="password" className="text-white">
        Contraseña
      </Label>
      <div className="relative">
        <Input
          id="password"
          type={isVisible ? "text" : "password"}
          placeholder="••••••••"
          value={value}
          onChange={onChange}
          required
          className="pr-11"
        />
        <button
          type="button"
          aria-label="Mostrar contraseña"
          onClick={() => setIsVisible((current) => !current)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
        >
          {isVisible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}
