import {
  CARD_ATTACHMENT_MAX_BYTES,
  CARD_ATTACHMENTS_MAX_PER_CARD,
  isAllowedCardAttachmentMime,
  isImageMime,
  resolveCardAttachmentMime,
} from '../config/card-attachment-limits';

describe('card-attachment-limits', () => {
  it('defines 10 MB max and 50 attachments per card', () => {
    expect(CARD_ATTACHMENT_MAX_BYTES).toBe(10 * 1024 * 1024);
    expect(CARD_ATTACHMENTS_MAX_PER_CARD).toBe(50);
  });

  it('allows common image and document mimes', () => {
    expect(isAllowedCardAttachmentMime('image/png')).toBe(true);
    expect(isAllowedCardAttachmentMime('application/pdf')).toBe(true);
  });

  it('blocks video uploads', () => {
    expect(isAllowedCardAttachmentMime('video/mp4')).toBe(false);
    expect(isAllowedCardAttachmentMime('video/webm')).toBe(false);
  });

  it('blocks unknown mimes', () => {
    expect(isAllowedCardAttachmentMime('application/x-msdownload')).toBe(false);
  });

  it('detects image mime', () => {
    expect(isImageMime('image/jpeg')).toBe(true);
    expect(isImageMime('application/pdf')).toBe(false);
    expect(isImageMime(null)).toBe(false);
  });

  it('resolves octet-stream from file extension', () => {
    expect(
      resolveCardAttachmentMime('application/octet-stream', 'photo.png'),
    ).toBe('image/png');
    expect(isAllowedCardAttachmentMime(
      resolveCardAttachmentMime('application/octet-stream', 'doc.pdf'),
    )).toBe(true);
  });
});
