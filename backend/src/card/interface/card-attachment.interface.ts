import type { UserBrief } from '../../common/interface';

export type CardAttachmentView = {
  id: number;
  cardId: number;
  kind: 'FILE' | 'LINK';
  fileName: string;
  mimeType: string | null;
  sizeBytes: number | null;
  url: string;
  previewUrl: string | null;
  isImage: boolean;
  isVideoLink: boolean;
  isCover: boolean;
  uploader: UserBrief;
  createdAt: string;
};
