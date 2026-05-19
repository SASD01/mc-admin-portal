import * as React from 'react';
import { APP_ROUTES } from '@/config/routes';
import { authService } from '@/services/auth.service';

export function AuthCallback() {
  const [message, setMessage] = React.useState('Validando sesión...');

  React.useEffect(() => {
    let mounted = true;

    authService.requireAdminSession().then((result) => {
      if (!mounted) return;
      if (result.ok) return window.location.assign(APP_ROUTES.agenda);
      setMessage(result.message ?? 'No tienes permisos para acceder.');
      window.setTimeout(() => window.location.assign(APP_ROUTES.login), 1600);
    });

    return () => {
      mounted = false;
    };
  }, []);

  return <p className="text-center text-sm text-white/80">{message}</p>;
}
