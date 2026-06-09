function normalizeIp(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith('::ffff:')) return trimmed.slice('::ffff:'.length);
  return trimmed;
}

function isHiddenClientIp(ip: string): boolean {
  if (ip === '::1' || ip === '127.0.0.1' || ip === 'localhost') return true;
  if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) return true;
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(ip)) return true;
  if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(ip)) return true;
  return false;
}

/** User-facing IP: strip ::ffff:, hide loopback and private/docker addresses. */
export function formatClientIpForDisplay(ip: string | null | undefined): string | null {
  if (!ip?.trim()) return null;
  const normalized = normalizeIp(ip);
  if (!normalized || isHiddenClientIp(normalized)) return null;
  return normalized;
}
