import { beforeEach, describe, expect, it, vi } from 'vitest';
import { api } from '@shared/api';
import {
  addCardAttachmentLink,
  deleteCardAttachment,
  fetchCardAttachments,
  formatAttachmentSize,
  setCardCover,
  uploadCardAttachment,
} from './cardAttachmentsApi';

vi.mock('@shared/api', () => ({
  api: vi.fn(),
  API_URL: 'http://api.test',
}));

describe('cardAttachmentsApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('fetch', vi.fn());
  });

  describe('formatAttachmentSize', () => {
    it('formats bytes, KB and MB', () => {
      expect(formatAttachmentSize(null)).toBe('');
      expect(formatAttachmentSize(512)).toBe('512 B');
      expect(formatAttachmentSize(2048)).toBe('2.0 KB');
      expect(formatAttachmentSize(5 * 1024 * 1024)).toBe('5.0 MB');
    });
  });

  it('fetchCardAttachments calls list endpoint', async () => {
    vi.mocked(api).mockResolvedValue([]);
    await fetchCardAttachments('tok', 1, 42);
    expect(api).toHaveBeenCalledWith('/workspace/1/cards/42/attachments', {
      method: 'GET',
      accessToken: 'tok',
    });
  });

  it('addCardAttachmentLink posts url payload', async () => {
    vi.mocked(api).mockResolvedValue({ id: 1 });
    await addCardAttachmentLink('tok', 1, 42, 'https://youtu.be/x', 'Vid');
    expect(api).toHaveBeenCalledWith('/workspace/1/cards/42/attachments/link', {
      method: 'POST',
      accessToken: 'tok',
      json: { url: 'https://youtu.be/x', fileName: 'Vid' },
    });
  });

  it('deleteCardAttachment and setCardCover use correct paths', async () => {
    vi.mocked(api).mockResolvedValue({ ok: true });
    await deleteCardAttachment('tok', 1, 42, 9);
    await setCardCover('tok', 1, 42, 7);
    expect(api).toHaveBeenCalledWith('/workspace/1/cards/42/attachments/9', {
      method: 'DELETE',
      accessToken: 'tok',
    });
    expect(api).toHaveBeenCalledWith('/workspace/1/cards/42/cover', {
      method: 'PATCH',
      accessToken: 'tok',
      json: { attachmentId: 7 },
    });
  });

  describe('uploadCardAttachment', () => {
    it('returns parsed row on success', async () => {
      const row = { id: 3, fileName: 'a.png' };
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        json: async () => row,
      } as Response);

      const file = new File(['x'], 'a.png', { type: 'image/png' });
      const result = await uploadCardAttachment('tok', 1, 42, file);

      expect(result).toEqual(row);
      expect(fetch).toHaveBeenCalledWith(
        'http://api.test/workspace/1/cards/42/attachments',
        expect.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer tok' },
        }),
      );
    });

    it('throws with API code on failure', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ code: 'FILE_TOO_LARGE', message: 'Too big' }),
      } as Response);

      const file = new File(['x'], 'big.bin', { type: 'application/octet-stream' });
      await expect(uploadCardAttachment('tok', 1, 42, file)).rejects.toMatchObject({
        message: 'Too big',
        code: 'FILE_TOO_LARGE',
        status: 400,
      });
    });
  });
});
