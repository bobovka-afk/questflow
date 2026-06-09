import { formatClientIpForDisplay } from './formatClientIp';
import { formatDateTimeRuSettings } from './formatDateRu';

type SecurityEventMetaRow = {
  createdAt: string;
  ipAddress?: string | null;
  deviceLabel?: string | null;
};

export function formatSecurityEventMeta(row: SecurityEventMetaRow): string {
  const parts = [formatDateTimeRuSettings(row.createdAt)];
  const ip = formatClientIpForDisplay(row.ipAddress);
  if (ip) parts.push(ip);
  if (row.deviceLabel) parts.push(row.deviceLabel);
  return parts.join(' · ');
}
