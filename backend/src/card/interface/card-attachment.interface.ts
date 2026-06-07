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
  uploader: { id: number; name: string };
  createdAt: string;
};
