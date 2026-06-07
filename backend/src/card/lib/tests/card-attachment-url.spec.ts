import { isVideoLinkUrl, linkDisplayName } from '../card-attachment-url';

describe('card-attachment-url', () => {
  describe('isVideoLinkUrl', () => {
    it('detects YouTube and Vimeo hosts', () => {
      expect(isVideoLinkUrl('https://www.youtube.com/watch?v=abc')).toBe(true);
      expect(isVideoLinkUrl('https://youtu.be/abc')).toBe(true);
      expect(isVideoLinkUrl('https://vimeo.com/123')).toBe(true);
    });

    it('returns false for generic links', () => {
      expect(isVideoLinkUrl('https://example.com/file.pdf')).toBe(false);
      expect(isVideoLinkUrl('not-a-url')).toBe(false);
    });
  });

  describe('linkDisplayName', () => {
    it('uses explicit fileName when provided', () => {
      expect(linkDisplayName('https://x.com', '  My doc  ')).toBe('My doc');
    });

    it('uses hostname for video links', () => {
      expect(linkDisplayName('https://www.youtube.com/watch?v=1')).toBe('youtube.com');
    });

    it('uses last path segment for other URLs', () => {
      expect(linkDisplayName('https://cdn.example.com/docs/spec.pdf')).toBe('spec.pdf');
    });
  });
});
