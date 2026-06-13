import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { File as MulterFile } from 'multer';
import sharp from 'sharp';
import { CardAttachmentKind } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import { UPLOAD_DIRS, buildUploadFilename } from '../uploads/local-uploads';
import {
  commitUpload,
  deleteUploadFile,
  resolvePublicUploadUrl,
  stagingPathForUpload,
} from '../uploads/upload-storage';
import {
  CARD_ATTACHMENT_MAX_BYTES,
  CARD_ATTACHMENTS_MAX_PER_CARD,
  isAllowedCardAttachmentMime,
  isImageMime,
  resolveCardAttachmentMime,
} from './config/card-attachment-limits';
import type { CardAttachmentView } from './interface/card-attachment.interface';
import { isVideoLinkUrl, linkDisplayName } from './lib/card-attachment-url';

@Injectable()
export class CardAttachmentService {
  constructor(private readonly prisma: PrismaService) {}

  async assertCardInWorkspace(cardId: number, workspaceId: number) {
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: {
        id: true,
        coverAttachmentId: true,
        list: { select: { board: { select: { workspaceId: true } } } },
      },
    });
    if (!card) {
      throw new NotFoundException({
        code: 'CARD_NOT_FOUND',
        message: 'Card not found',
      });
    }
    if (card.list.board.workspaceId !== workspaceId) {
      throw new NotFoundException({
        code: 'CARD_NOT_FOUND',
        message: 'Card not found',
      });
    }
    return card;
  }

  async listForCard(
    cardId: number,
    workspaceId: number,
  ): Promise<CardAttachmentView[]> {
    await this.assertCardInWorkspace(cardId, workspaceId);
    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: { coverAttachmentId: true },
    });
    const rows = await this.prisma.cardAttachment.findMany({
      where: { cardId },
      orderBy: { createdAt: 'desc' },
      include: {
        uploader: { select: { id: true, name: true, avatarPath: true } },
      },
    });
    return rows.map((row) =>
      this.toView(row, card?.coverAttachmentId ?? null),
    );
  }

  async uploadFile(
    cardId: number,
    workspaceId: number,
    uploaderId: number,
    file: MulterFile,
  ): Promise<CardAttachmentView> {
    await this.assertCardInWorkspace(cardId, workspaceId);
    if (!file) {
      throw new BadRequestException({
        code: 'FILE_NOT_PROVIDED',
        message: 'File is not provided',
      });
    }
    if (file.size > CARD_ATTACHMENT_MAX_BYTES) {
      throw new BadRequestException({
        code: 'FILE_TOO_LARGE',
        message: `Max file size is ${CARD_ATTACHMENT_MAX_BYTES / (1024 * 1024)} MB`,
      });
    }
    const mimeType = resolveCardAttachmentMime(file.mimetype, file.originalname);
    if (!isAllowedCardAttachmentMime(mimeType)) {
      throw new BadRequestException({
        code: 'MIME_NOT_ALLOWED',
        message: 'File type is not allowed. Upload video as a link instead.',
      });
    }

    const count = await this.prisma.cardAttachment.count({
      where: { cardId },
    });
    if (count >= CARD_ATTACHMENTS_MAX_PER_CARD) {
      throw new BadRequestException({
        code: 'ATTACHMENT_LIMIT',
        message: 'Too many attachments on this card',
      });
    }

    const ext = path.extname(file.originalname) || '';
    const safeExt = ext.slice(0, 12).replace(/[^a-zA-Z0-9.]/g, '') || '.bin';

    const storageFile = buildUploadFilename(cardId, safeExt);
    const relStoragePath = `${UPLOAD_DIRS.cardAttachments}/${storageFile}`;
    const absStorage = stagingPathForUpload(relStoragePath);

    let relPreviewPath: string | null = null;
    let absPreview: string | null = null;
    const tempPath = file.path;
    if (!tempPath) {
      throw new BadRequestException({
        code: 'FILE_NOT_PROVIDED',
        message: 'Upload temp file missing',
      });
    }

    try {
      if (isImageMime(mimeType)) {
        const previewFile = buildUploadFilename(`${cardId}-preview`, '.webp');
        relPreviewPath = `${UPLOAD_DIRS.cardAttachments}/${previewFile}`;
        absPreview = stagingPathForUpload(relPreviewPath);
        try {
          await sharp(tempPath)
            .rotate()
            .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(absPreview);
          await sharp(tempPath)
            .rotate()
            .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
            .toFile(absStorage);
        } catch {
          fs.copyFileSync(tempPath, absStorage);
          relPreviewPath = null;
        }
      } else {
        fs.copyFileSync(tempPath, absStorage);
      }
    } finally {
      fs.rmSync(tempPath, { force: true });
    }

    const storageUrl = await commitUpload(relStoragePath, absStorage, mimeType);
    const previewUrl =
      relPreviewPath != null && absPreview != null
        ? await commitUpload(relPreviewPath, absPreview, 'image/webp')
        : null;

    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: { coverAttachmentId: true },
    });

    const row = await this.prisma.cardAttachment.create({
      data: {
        cardId,
        uploaderId,
        kind: CardAttachmentKind.FILE,
        fileName: file.originalname.slice(0, 200) || storageFile,
        mimeType,
        sizeBytes: file.size,
        storagePath: storageUrl,
        previewPath: previewUrl,
      },
      include: { uploader: { select: { id: true, name: true, avatarPath: true } } },
    });

    return this.toView(row, card?.coverAttachmentId ?? null);
  }

  async addLink(
    cardId: number,
    workspaceId: number,
    uploaderId: number,
    url: string,
    fileName?: string,
  ): Promise<CardAttachmentView> {
    await this.assertCardInWorkspace(cardId, workspaceId);
    const count = await this.prisma.cardAttachment.count({ where: { cardId } });
    if (count >= CARD_ATTACHMENTS_MAX_PER_CARD) {
      throw new BadRequestException({
        code: 'ATTACHMENT_LIMIT',
        message: 'Too many attachments on this card',
      });
    }

    const card = await this.prisma.card.findUnique({
      where: { id: cardId },
      select: { coverAttachmentId: true },
    });

    const row = await this.prisma.cardAttachment.create({
      data: {
        cardId,
        uploaderId,
        kind: CardAttachmentKind.LINK,
        fileName: linkDisplayName(url, fileName),
        externalUrl: url,
      },
      include: { uploader: { select: { id: true, name: true, avatarPath: true } } },
    });

    return this.toView(row, card?.coverAttachmentId ?? null);
  }

  async deleteAttachment(
    cardId: number,
    workspaceId: number,
    attachmentId: number,
  ): Promise<void> {
    await this.assertCardInWorkspace(cardId, workspaceId);
    const row = await this.prisma.cardAttachment.findFirst({
      where: { id: attachmentId, cardId },
    });
    if (!row) {
      throw new NotFoundException({
        code: 'ATTACHMENT_NOT_FOUND',
        message: 'Attachment not found',
      });
    }

    await this.prisma.card.updateMany({
      where: { id: cardId, coverAttachmentId: attachmentId },
      data: { coverAttachmentId: null },
    });

    await this.prisma.cardAttachment.delete({ where: { id: attachmentId } });

    await deleteUploadFile(row.storagePath);
    await deleteUploadFile(row.previewPath);
  }

  async setCover(
    cardId: number,
    workspaceId: number,
    attachmentId: number | null,
  ): Promise<void> {
    await this.assertCardInWorkspace(cardId, workspaceId);
    if (attachmentId == null) {
      await this.prisma.card.update({
        where: { id: cardId },
        data: { coverAttachmentId: null },
      });
      return;
    }
    const row = await this.prisma.cardAttachment.findFirst({
      where: { id: attachmentId, cardId },
    });
    if (!row || row.kind !== CardAttachmentKind.FILE || !isImageMime(row.mimeType)) {
      throw new BadRequestException({
        code: 'COVER_NOT_IMAGE',
        message: 'Only image attachments can be used as cover',
      });
    }
    await this.prisma.card.update({
      where: { id: cardId },
      data: { coverAttachmentId: attachmentId },
    });
  }

  coverPreviewUrl(
    cover: {
      previewPath: string | null;
      storagePath: string | null;
      mimeType: string | null;
    } | null,
  ): string | null {
    if (!cover || !isImageMime(cover.mimeType)) return null;
    return (
      resolvePublicUploadUrl(cover.previewPath) ??
      resolvePublicUploadUrl(cover.storagePath)
    );
  }

  private toView(
    row: {
      id: number;
      cardId: number;
      kind: CardAttachmentKind;
      fileName: string;
      mimeType: string | null;
      sizeBytes: number | null;
      storagePath: string | null;
      previewPath: string | null;
      externalUrl: string | null;
      createdAt: Date;
      uploader: { id: number; name: string; avatarPath: string | null };
    },
    coverAttachmentId: number | null,
  ): CardAttachmentView {
    const isLink = row.kind === CardAttachmentKind.LINK;
    const external = row.externalUrl ?? '';
    const isVideoLink = isLink && isVideoLinkUrl(external);
    let url = external;
    let previewUrl: string | null = null;
    if (!isLink && row.storagePath) {
      url = resolvePublicUploadUrl(row.storagePath) ?? url;
      previewUrl = resolvePublicUploadUrl(row.previewPath);
      if (!previewUrl && isImageMime(row.mimeType)) {
        previewUrl = url;
      }
    }

    return {
      id: row.id,
      cardId: row.cardId,
      kind: isLink ? 'LINK' : 'FILE',
      fileName: row.fileName,
      mimeType: row.mimeType,
      sizeBytes: row.sizeBytes,
      url,
      previewUrl,
      isImage: isImageMime(row.mimeType),
      isVideoLink,
      isCover: coverAttachmentId === row.id,
      uploader: row.uploader,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
