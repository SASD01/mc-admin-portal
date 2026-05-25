import { supabase } from '@/lib/supabase';
import { APP_ROUTES } from '@/config/routes';
import type { AuthResult, LoginCredentials } from '@/types/auth';

const ADMIN_DENIED = 'Acceso restringido a administradores.';

function getOrigin() {
  return typeof window === 'undefined' ? '' : window.location.origin;
}

async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('administrators')
    .select('id')
    .eq('id', userId)
    .single();
  return !error && !!data;
}

async function rejectAccess(): Promise<AuthResult> {
  await supabase.auth.signOut();
  return { ok: false, message: ADMIN_DENIED };
}

export const authService = {
  async signInWithPassword(credentials: LoginCredentials): Promise<AuthResult> {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) return { ok: false, message: 'Credenciales incorrectas.' };
    if (!data.user) return { ok: false, message: 'Error al iniciar sesión.' };
    if (!(await isAdmin(data.user.id))) return rejectAccess();
    return { ok: true };
  },

  async signInWithGoogle(): Promise<AuthResult> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${getOrigin()}${APP_ROUTES.authCallback}` },
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true };
  },

  async requireAdminSession(): Promise<AuthResult> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) return { ok: false, message: 'Sesión no encontrada.' };
    if (!(await isAdmin(data.user.id))) return rejectAccess();
    return { ok: true };
  },

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  },
};
