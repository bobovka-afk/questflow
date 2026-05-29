export function formatFriendCode(code: number): string {
  return `#${code}`;
}

export function parseFriendCodeInput(raw: string): number | null {
  const trimmed = raw.trim().replace(/^#/, '');
  if (!/^\d{4}$/.test(trimmed)) return null;
  const code = Number(trimmed);
  if (code < 1000 || code > 9999) return null;
  return code;
}
