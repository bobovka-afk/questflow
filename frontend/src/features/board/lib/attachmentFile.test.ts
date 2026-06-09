import { describe, expect, it } from 'vitest';
import {
  getImageFileFromDataTransfer,
  MAX_ATTACHMENT_BYTES,
  normalizePastedImageFile,
  validateAttachmentFile,
} from './attachmentFile';

describe('validateAttachmentFile', () => {
  it('rejects oversized files', () => {
    const file = new File(['x'], 'big.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: MAX_ATTACHMENT_BYTES + 1 });
    expect(validateAttachmentFile(file)).toMatch(/10 МБ/);
  });

  it('rejects video files', () => {
    const file = new File(['x'], 'clip.mp4', { type: 'video/mp4' });
    expect(validateAttachmentFile(file)).toMatch(/Видео/);
  });

  it('accepts images', () => {
    const file = new File(['x'], 'shot.png', { type: 'image/png' });
    expect(validateAttachmentFile(file)).toBeNull();
  });
});

describe('normalizePastedImageFile', () => {
  it('keeps original name when present', () => {
    const file = new File(['x'], 'my-shot.png', { type: 'image/png' });
    expect(normalizePastedImageFile(file).name).toBe('my-shot.png');
  });

  it('generates screenshot name for anonymous clipboard images', () => {
    const file = new File(['x'], 'image.png', { type: 'image/png' });
    expect(normalizePastedImageFile(file).name).toMatch(/^screenshot-.*\.png$/);
  });
});

describe('getImageFileFromDataTransfer', () => {
  it('returns null when no image is present', () => {
    const data = {
      items: [{ kind: 'string', type: 'text/plain', getAsFile: () => null }],
      files: [],
    } as unknown as DataTransfer;
    expect(getImageFileFromDataTransfer(data)).toBeNull();
  });

  it('extracts image from clipboard items', () => {
    const source = new File(['img'], 'image.png', { type: 'image/png' });
    const data = {
      items: [
        {
          kind: 'file',
          type: 'image/png',
          getAsFile: () => source,
        },
      ],
      files: [],
    } as unknown as DataTransfer;
    const result = getImageFileFromDataTransfer(data);
    expect(result?.type).toBe('image/png');
    expect(result?.name).toMatch(/^screenshot-.*\.png$/);
  });
});
