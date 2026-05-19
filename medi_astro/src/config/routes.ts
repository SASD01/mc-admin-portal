export const APP_ROUTES = {
  home: "/",
  login: "/auth/login",
  authCallback: "/auth/callback",
  agenda: "/agenda",
  staff: "/personal-medico",
  settings: "/configuracion",
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
