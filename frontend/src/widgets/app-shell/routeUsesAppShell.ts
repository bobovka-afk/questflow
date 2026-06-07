/** Routes that show the pixel icon rail when the user is authenticated. */
export function routeUsesAppShell(route: string, accessToken: string | null): boolean {
  if (!accessToken) return false;
  if (route === '/') return false;
  if (route.startsWith('/test/')) return false;
  if (route.startsWith('/email-verified')) return false;
  if (route.startsWith('/reset-password')) return false;
  return true;
}
