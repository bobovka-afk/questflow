/** /profile/user/:id → /profile/:id (и /character) */
export function canonicalProfilePath(pathname: string): string | null {
  const m =
    pathname.match(/^\/profile\/user\/(\d+)(\/character)?\/?$/) ??
    pathname.match(/^\/profile\/user\/(\d+)$/);
  if (!m) return null;
  const suffix = m[2] ? '/character' : '';
  return `/profile/${m[1]}${suffix}`;
}
