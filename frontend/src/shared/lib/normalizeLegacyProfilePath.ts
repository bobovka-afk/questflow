/** Legacy profile URLs → character-centric routes */
export function canonicalProfilePath(pathname: string): string | null {
  if (pathname === '/profile' || pathname === '/profile/') {
    return '/profile/character';
  }
  if (pathname === '/profile/me' || pathname === '/profile/me/') {
    return '/profile/character';
  }

  const legacyUser =
    pathname.match(/^\/profile\/user\/(\d+)(\/character)?\/?$/) ??
    pathname.match(/^\/profile\/user\/(\d+)$/);
  if (legacyUser) {
    return `/profile/${legacyUser[1]}/character`;
  }

  const bareUser = pathname.match(/^\/profile\/(\d+)\/?$/);
  if (bareUser) {
    return `/profile/${bareUser[1]}/character`;
  }

  const bareAt = pathname.match(/^\/profile\/@([a-z0-9_]{3,32})\/?$/);
  if (bareAt) {
    return `/profile/@${bareAt[1]}/character`;
  }

  return null;
}
