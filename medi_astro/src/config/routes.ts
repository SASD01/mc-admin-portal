export const APP_ROUTES = {
  login:        '/auth/login',
  authCallback: '/auth/callback',
  agenda:       '/agenda',
  staff:        '/personal-medico',
} as const;

export type AppRoute = (typeof APP_ROUTES)[keyof typeof APP_ROUTES];
