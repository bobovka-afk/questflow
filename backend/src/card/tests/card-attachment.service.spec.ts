import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { CardAttachmentKind } from '../../generated/prisma/enums';
import { createPrismaMock } from '../../testing/prisma-mock';
import { CARD_ATTACHMENT_MAX_BYTES } from '../config/card-attachment-limits';
import { CardAttachmentService } from '../card-attachment.service';

const toFile = jest.fn().mockResolvedValue(undefined);
const resize = jest.fn(() => ({
  webp: () => ({ toFile }),
  toFile,
}));
const rotate = jest.fn(() => ({ resize }));

jest.mock('sharp', () => jest.fn(() => ({ rotate })));

jest.mock('fs', () => ({
  mkdirSync: jest.fn(),
  copyFileSync: jest.fn(),
  rmSync: jest.fn(),
}));

describe('CardAttachmentService', () => {
  let service: CardAttachmentService;
  let prisma: ReturnType<typeof createPrismaMock>;

  const uploader = { id: 2, name: 'Alice' };
  const createdAt = new Date('2026-06-06T12:00:00.000Z');

  function mockCardInWorkspace(workspaceId = 10, coverAttachmentId: number | null = null) {
    prisma.card!.findUnique!.mockResolvedValue({
      id: 1,
      coverAttachmentId,
      list: { board: { workspaceId } },
    });
  }

  beforeEach(() => {
    prisma = createPrismaMock();
    service = new CardAttachmentService(prisma as never);
    jest.clearAllMocks();
    process.env.SERVER_URL = 'http://test.local';
  });

  it('throws when card is missing', async () => {
    prisma.card!.findUnique!.mockResolvedValue(null);
    await expect(service.listForCard(1, 10)).rejects.toThrow(NotFoundException);
  });

  it('throws when card belongs to another workspace', async () => {
    mockCardInWorkspace(99);
    await expect(service.listForCard(1, 10)).rejects.toThrow(NotFoundException);
  });

  it('lists attachments with cover flag', async () => {
    mockCardInWorkspace(10, 7);
    prisma.cardAttachment!.findMany!.mockResolvedValue([
      {
        id: 7,
        cardId: 1,
        kind: CardAttachmentKind.FILE,
        fileName: 'shot.png',
        mimeType: 'image/png',
        sizeBytes: 100,
        storagePath: 'card-attachments/10/1/a.png',
        previewPath: 'card-attachments/10/1/a-preview.webp',
        externalUrl: null,
        createdAt,
        uploader,
      },
      {
        id: 8,
        cardId: 1,
        kind: CardAttachmentKind.LINK,
        fileName: 'youtube.com',
        mimeType: null,
        sizeBytes: null,
        storagePath: null,
        previewPath: null,
        externalUrl: 'https://www.youtube.com/watch?v=1',
        createdAt,
        uploader,
      },
    ]);

    const list = await service.listForCard(1, 10);
    expect(list).toHaveLength(2);
    expect(list[0].isCover).toBe(true);
    expect(list[0].previewUrl).toContain('/uploads/');
    expect(list[1].isVideoLink).toBe(true);
    expect(list[1].kind).toBe('LINK');
  });

  it('rejects upload without file', async () => {
    mockCardInWorkspace();
    await expect(
      service.uploadFile(1, 10, 2, undefined as never),
    ).rejects.toMatchObject({ response: { code: 'FILE_NOT_PROVIDED' } });
  });

  it('rejects oversized file', async () => {
    mockCardInWorkspace();
    await expect(
      service.uploadFile(1, 10, 2, {
        size: CARD_ATTACHMENT_MAX_BYTES + 1,
        mimetype: 'image/png',
        originalname: 'big.png',
        path: '/tmp/x',
      } as never),
    ).rejects.toMatchObject({ response: { code: 'FILE_TOO_LARGE' } });
  });

  it('rejects video mime on upload', async () => {
    mockCardInWorkspace();
    await expect(
      service.uploadFile(1, 10, 2, {
        size: 100,
        mimetype: 'video/mp4',
        originalname: 'clip.mp4',
        path: '/tmp/x',
      } as never),
    ).rejects.toMatchObject({ response: { code: 'MIME_NOT_ALLOWED' } });
  });

  it('rejects upload when attachment limit reached', async () => {
    mockCardInWorkspace();
    prisma.cardAttachment!.count!.mockResolvedValue(50);
    await expect(
      service.uploadFile(1, 10, 2, {
        size: 100,
        mimetype: 'application/pdf',
        originalname: 'doc.pdf',
        path: '/tmp/doc.pdf',
      } as never),
    ).rejects.toMatchObject({ response: { code: 'ATTACHMENT_LIMIT' } });
  });

  it('uploads pdf file without sharp preview', async () => {
    mockCardInWorkspace();
    prisma.cardAttachment!.count!.mockResolvedValue(0);
    prisma.cardAttachment!.create!.mockResolvedValue({
      id: 3,
      cardId: 1,
      kind: CardAttachmentKind.FILE,
      fileName: 'doc.pdf',
      mimeType: 'application/pdf',
      sizeBytes: 500,
      storagePath: 'card-attachments/10/1/uuid.pdf',
      previewPath: null,
      externalUrl: null,
      createdAt,
      uploader,
    });

    const view = await service.uploadFile(1, 10, 2, {
      size: 500,
      mimetype: 'application/pdf',
      originalname: 'doc.pdf',
      path: '/tmp/doc.pdf',
    } as never);

    expect(view.kind).toBe('FILE');
    expect(view.previewUrl).toBeNull();
    expect(view.url).toContain('uuid.pdf');
    expect(prisma.cardAttachment!.create).toHaveBeenCalled();
  });

  it('adds external link with video flag', async () => {
    mockCardInWorkspace();
    prisma.cardAttachment!.count!.mockResolvedValue(0);
    prisma.cardAttachment!.create!.mockResolvedValue({
      id: 9,
      cardId: 1,
      kind: CardAttachmentKind.LINK,
      fileName: 'youtube.com',
      mimeType: null,
      sizeBytes: null,
      storagePath: null,
      previewPath: null,
      externalUrl: 'https://www.youtube.com/watch?v=abc',
      createdAt,
      uploader,
    });

    const view = await service.addLink(
      1,
      10,
      2,
      'https://www.youtube.com/watch?v=abc',
      'Demo',
    );

    expect(view.isVideoLink).toBe(true);
    expect(view.url).toBe('https://www.youtube.com/watch?v=abc');
    expect(prisma.cardAttachment!.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          kind: CardAttachmentKind.LINK,
          fileName: 'Demo',
        }),
      }),
    );
  });

  it('deletes attachment and clears cover', async () => {
    mockCardInWorkspace(10, 5);
    prisma.cardAttachment!.findFirst!.mockResolvedValue({
      id: 5,
      cardId: 1,
      storagePath: 'card-attachments/10/1/f.png',
      previewPath: 'card-attachments/10/1/f-preview.webp',
    });

    await service.deleteAttachment(1, 10, 5);

    expect(prisma.card!.updateMany).toHaveBeenCalledWith({
      where: { id: 1, coverAttachmentId: 5 },
      data: { coverAttachmentId: null },
    });
    expect(prisma.cardAttachment!.delete).toHaveBeenCalledWith({
      where: { id: 5 },
    });
  });

  it('throws when deleting missing attachment', async () => {
    mockCardInWorkspace();
    prisma.cardAttachment!.findFirst!.mockResolvedValue(null);
    await expect(service.deleteAttachment(1, 10, 99)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('rejects cover for non-image attachment', async () => {
    mockCardInWorkspace();
    prisma.cardAttachment!.findFirst!.mockResolvedValue({
      id: 5,
      cardId: 1,
      kind: CardAttachmentKind.LINK,
      mimeType: null,
    });
    await expect(service.setCover(1, 10, 5)).rejects.toThrow(BadRequestException);
  });

  it('sets cover for image file', async () => {
    mockCardInWorkspace();
    prisma.cardAttachment!.findFirst!.mockResolvedValue({
      id: 5,
      cardId: 1,
      kind: CardAttachmentKind.FILE,
      mimeType: 'image/png',
    });

    await service.setCover(1, 10, 5);

    expect(prisma.card!.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { coverAttachmentId: 5 },
    });
  });

  it('clears cover when attachmentId is null', async () => {
    mockCardInWorkspace(10, 5);
    await service.setCover(1, 10, null);
    expect(prisma.card!.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { coverAttachmentId: null },
    });
  });

  it('coverPreviewUrl prefers preview path', () => {
    const url = service.coverPreviewUrl({
      mimeType: 'image/png',
      previewPath: 'card-attachments/1/2/p.webp',
      storagePath: 'card-attachments/1/2/full.png',
    });
    expect(url).toBe('http://test.local/uploads/card-attachments/1/2/p.webp');
  });

  it('coverPreviewUrl returns null for non-image', () => {
    expect(
      service.coverPreviewUrl({
        mimeType: 'application/pdf',
        previewPath: null,
        storagePath: 'x.pdf',
      }),
    ).toBeNull();
  });
});
