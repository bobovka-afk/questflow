import { describe, expect, it } from 'vitest';
import { attachmentIdsEmbeddedInComments } from './commentAttachmentActivity';

const att = (
  id: number,
  fileName: string,
  url: string,
  previewUrl?: string | null,
) => ({
  id,
  fileName,
  url,
  previewUrl: previewUrl ?? null,
});

describe('attachmentIdsEmbeddedInComments', () => {
  it('returns empty when there are no attachments', () => {
    expect(attachmentIdsEmbeddedInComments([], [{ body: 'x' }])).toEqual(new Set());
  });

  it('matches exact url in markdown image', () => {
    const url = 'http://localhost:3000/uploads/card-attachments/1-123-abc.png';
    const ids = attachmentIdsEmbeddedInComments(
      [att(1, 'shot.png', url)],
      [{ body: `![shot.png](${url})` }],
    );
    expect(ids).toEqual(new Set([1]));
  });

  it('matches by upload path when host differs', () => {
    const commentUrl = 'http://localhost:3000/uploads/card-attachments/1-123-abc.png';
    const attachmentUrl = 'http://127.0.0.1:3000/uploads/card-attachments/1-123-abc.png';
    const ids = attachmentIdsEmbeddedInComments(
      [att(1, 'shot.png', attachmentUrl)],
      [{ body: `![shot.png](${commentUrl})` }],
    );
    expect(ids).toEqual(new Set([1]));
  });

  it('matches by file name in markdown image alt text', () => {
    const ids = attachmentIdsEmbeddedInComments(
      [att(1, 'screenshot.png', 'http://a/one.png')],
      [{ body: '![screenshot.png](http://b/two.png)' }],
    );
    expect(ids).toEqual(new Set([1]));
  });

  it('matches non-image file link by name', () => {
    const ids = attachmentIdsEmbeddedInComments(
      [att(2, 'doc.pdf', 'http://a/doc.pdf')],
      [{ body: '[📎 doc.pdf](http://b/doc.pdf)' }],
    );
    expect(ids).toEqual(new Set([2]));
  });

  it('does not match unrelated attachments', () => {
    const ids = attachmentIdsEmbeddedInComments(
      [att(1, 'a.png', 'http://a/a.png')],
      [{ body: 'plain text' }],
    );
    expect(ids).toEqual(new Set());
  });
});
