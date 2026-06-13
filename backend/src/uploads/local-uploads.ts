import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

export const UPLOAD_DIRS = {
  userAvatars: 'user-avatars',
  cardAttachments: 'card-attachments',
} as const;

export type UploadDir = (typeof UPLOAD_DIRS)[keyof typeof UPLOAD_DIRS];

export function uploadsRoot(): string {
  return path.join(process.cwd(), 'uploads');
}

export function ensureUploadDir(subdir: UploadDir): string {
  const dir = path.join(uploadsRoot(), subdir);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function buildUploadFilename(prefix: string | number, ext: string): string {
  const normalizedExt = ext.startsWith('.') ? ext : ext ? `.${ext}` : '';
  return `${prefix}-${Date.now()}-${randomUUID()}${normalizedExt}`;
}

export function toRelativeUploadPath(stored: string): string | null {
  const normalized = stored.replace(/\\/g, '/');
  if (normalized.startsWith('http://') || normalized.startsWith('https://')) {
    const marker = '/uploads/';
    const idx = normalized.indexOf(marker);
    if (idx === -1) return null;
    return normalized.slice(idx + marker.length);
  }
  return normalized.replace(/^\/+/, '');
}

export function absoluteUploadPath(storedOrRelative: string): string | null {
  const rel = toRelativeUploadPath(storedOrRelative);
  if (!rel) return null;
  return path.join(uploadsRoot(), rel);
}
