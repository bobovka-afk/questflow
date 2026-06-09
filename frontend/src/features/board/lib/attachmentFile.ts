export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

export function validateAttachmentFile(file: File): string | null {
  if (file.size > MAX_ATTACHMENT_BYTES) {
    return 'Файл больше 10 МБ.';
  }
  if (file.type.startsWith('video/')) {
    return 'Видео прикрепляйте ссылкой, не файлом.';
  }
  return null;
}

function pastedImageFileName(mimeType: string): string {
  const ext =
    mimeType === 'image/jpeg'
      ? 'jpg'
      : mimeType === 'image/webp'
        ? 'webp'
        : mimeType === 'image/gif'
          ? 'gif'
          : 'png';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `screenshot-${stamp}.${ext}`;
}

export function normalizePastedImageFile(file: File): File {
  const trimmedName = file.name?.trim();
  if (trimmedName && trimmedName !== 'image.png') {
    return file;
  }
  const mimeType = file.type || 'image/png';
  return new File([file], pastedImageFileName(mimeType), { type: mimeType });
}

export function getImageFileFromDataTransfer(data: DataTransfer | null): File | null {
  if (!data) return null;

  for (const item of data.items) {
    if (item.kind !== 'file' || !item.type.startsWith('image/')) continue;
    const file = item.getAsFile();
    if (file) return normalizePastedImageFile(file);
  }

  for (const file of data.files) {
    if (file.type.startsWith('image/')) {
      return normalizePastedImageFile(file);
    }
  }

  return null;
}

export function getImageFileFromClipboardEvent(event: ClipboardEvent): File | null {
  return getImageFileFromDataTransfer(event.clipboardData);
}
