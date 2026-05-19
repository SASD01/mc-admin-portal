import { Button } from "@/components/ui/button";
import { GoogleIcon } from "./google-icon";

interface GoogleAuthButtonProps {
  disabled: boolean;
  onClick: () => void;
}

export function GoogleAuthButton({ disabled, onClick }: GoogleAuthButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="h-11 w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
      onClick={onClick}
      disabled={disabled}
    >
      <GoogleIcon /> Iniciar Sesión con Google
    </Button>
  );
}
