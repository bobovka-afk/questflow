export const CARD_ATTACHMENT_MAX_BYTES = 10 * 1024 * 1024;

export const CARD_ATTACHMENTS_MAX_PER_CARD = 50;

const BLOCKED_MIME_PREFIXES = ['video/'];

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/zip',
  'application/x-zip-compressed',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
]);

export function isAllowedCardAttachmentMime(mime: string): boolean {
  const lower = mime.toLowerCase();
  if (BLOCKED_MIME_PREFIXES.some((p) => lower.startsWith(p))) {
    return false;
  }
  return ALLOWED_MIME_TYPES.has(lower);
}

export function isImageMime(mime: string | null | undefined): boolean {
  return Boolean(mime?.toLowerCase().startsWith('image/'));
}

const MIME_BY_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.csv': 'text/csv',
  '.zip': 'application/zip',
  '.doc': 'application/msword',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx':
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.ppt': 'application/vnd.ms-powerpoint',
  '.pptx':
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
};

/** Браузер часто шлёт application/octet-stream — уточняем по расширению. */
export function resolveCardAttachmentMime(
  mimetype: string | undefined,
  originalname: string,
): string {
  const raw = (mimetype ?? '').toLowerCase().trim();
  if (raw && raw !== 'application/octet-stream') return raw;
  const ext = originalname.includes('.')
    ? originalname.slice(originalname.lastIndexOf('.')).toLowerCase()
    : '';
  return MIME_BY_EXT[ext] ?? (raw || 'application/octet-stream');
}
