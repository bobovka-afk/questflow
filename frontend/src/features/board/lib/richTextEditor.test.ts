import { describe, expect, it } from 'vitest';
import { attachmentMarkdown } from './richTextEditor';

describe('attachmentMarkdown', () => {
  it('formats image as markdown image', () => {
    expect(
      attachmentMarkdown({
        fileName: 'a.png',
        url: 'http://x/u.png',
        isImage: true,
      }),
    ).toContain('![a.png](http://x/u.png)');
  });

  it('formats file as markdown link', () => {
    expect(
      attachmentMarkdown({
        fileName: 'doc.pdf',
        url: 'http://x/doc.pdf',
        isImage: false,
      }),
    ).toContain('[📎 doc.pdf](http://x/doc.pdf)');
  });
});
