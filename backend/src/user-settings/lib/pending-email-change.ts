export type PendingEmailChangeJson = {
  newEmail: string;
  oldConfirmedAt: string | null;
  newConfirmedAt: string | null;
  requestedAt: string;
};

export function isPendingEmailChange(raw: unknown): raw is PendingEmailChangeJson {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) return false;
  const o = raw as Record<string, unknown>;
  return typeof o.newEmail === 'string' && o.newEmail.length > 0;
}
