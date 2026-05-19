import { Loader2 } from "lucide-react";
import * as React from "react";
import { APP_ROUTES } from "@/config/routes";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { AuthDivider } from "./auth-divider";
import { AuthMessage } from "./auth-message";
import { EmailField } from "./email-field";
import { GoogleAuthButton } from "./google-auth-button";
import { LoginCardHeader } from "./login-card-header";
import { PasswordField } from "./password-field";

const initialState = { email: "", password: "" };

export function LoginForm() {
  const [credentials, setCredentials] = React.useState(initialState);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const updateField =
    (field: keyof typeof initialState) =>
    (event: React.ChangeEvent<HTMLInputElement>) =>
      setCredentials((current) => ({
        ...current,
        [field]: event.target.value,
      }));

  const runAuth = async (
    authRequest: () => Promise<{ ok: boolean; message?: string }>,
    redirectOnSuccess = true,
  ) => {
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await authRequest();
      if (!result.ok)
        return setMessage(result.message ?? "No se pudo iniciar sesión.");
      if (redirectOnSuccess) window.location.assign(APP_ROUTES.agenda);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Error inesperado.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void runAuth(() => authService.signInWithPassword(credentials));
  };

  return (
    <section className="w-full max-w-124 rounded-xl border border-white/5 bg-card/95 px-10 py-10 shadow-2xl backdrop-blur sm:px-12">
      <LoginCardHeader />
      <form className="space-y-6" onSubmit={submit}>
        <EmailField value={credentials.email} onChange={updateField("email")} />
        <div className="space-y-3">
          <PasswordField
            value={credentials.password}
            onChange={updateField("password")}
          />
          <a
            href="#"
            className="block text-right text-sm text-white/80 underline-offset-4 hover:text-white hover:underline"
          >
            Olvidaste la contraseña?
          </a>
        </div>
        <AuthMessage message={message} />
        <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="size-4 animate-spin" />} Iniciar
          Sesión
        </Button>
      </form>
      <AuthDivider />
      <GoogleAuthButton
        disabled={isSubmitting}
        onClick={() => void runAuth(authService.signInWithGoogle, false)}
      />
    </section>
  );
}
