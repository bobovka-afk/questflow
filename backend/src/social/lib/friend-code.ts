export const FRIEND_CODE_MIN = 1000;
export const FRIEND_CODE_MAX = 9999;

export function formatFriendCode(code: number): string {
  return `#${code}`;
}

export function parseFriendCodeInput(raw: string | number): number | null {
  if (typeof raw === 'number') {
    return Number.isInteger(raw) && raw >= FRIEND_CODE_MIN && raw <= FRIEND_CODE_MAX
      ? raw
      : null;
  }
  const trimmed = raw.trim().replace(/^#/, '');
  if (!/^\d{4}$/.test(trimmed)) return null;
  const code = Number(trimmed);
  if (code < FRIEND_CODE_MIN || code > FRIEND_CODE_MAX) return null;
  return code;
}

export function randomFriendCode(): number {
  return (
    FRIEND_CODE_MIN +
    Math.floor(Math.random() * (FRIEND_CODE_MAX - FRIEND_CODE_MIN + 1))
  );
}
