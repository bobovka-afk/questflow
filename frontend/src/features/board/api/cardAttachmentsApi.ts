import { api, API_URL } from '@shared/api';

import type { ActivityUserBrief } from '@entities/user';

export type CardAttachmentRow = {
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
  uploader: ActivityUserBrief;
  createdAt: string;
};

export function fetchCardAttachments(
  accessToken: string,
  workspaceId: number,
  cardId: number,
) {
  return api<CardAttachmentRow[]>(
    `/workspace/${workspaceId}/cards/${cardId}/attachments`,
    { method: 'GET', accessToken },
  );
}

export async function uploadCardAttachment(
  accessToken: string,
  workspaceId: number,
  cardId: number,
  file: File,
): Promise<CardAttachmentRow> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(
    `${API_URL}/workspace/${workspaceId}/cards/${cardId}/attachments`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
      body: form,
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(
      typeof data.message === 'string' ? data.message : 'Upload failed',
    ) as Error & { code?: string; status?: number };
    err.code = data.code;
    err.status = res.status;
    throw err;
  }
  return data as CardAttachmentRow;
}

export function addCardAttachmentLink(
  accessToken: string,
  workspaceId: number,
  cardId: number,
  url: string,
  fileName?: string,
) {
  return api<CardAttachmentRow>(
    `/workspace/${workspaceId}/cards/${cardId}/attachments/link`,
    {
      method: 'POST',
      accessToken,
      json: { url, fileName },
    },
  );
}

export function deleteCardAttachment(
  accessToken: string,
  workspaceId: number,
  cardId: number,
  attachmentId: number,
) {
  return api<{ ok: boolean }>(
    `/workspace/${workspaceId}/cards/${cardId}/attachments/${attachmentId}`,
    { method: 'DELETE', accessToken },
  );
}

export function setCardCover(
  accessToken: string,
  workspaceId: number,
  cardId: number,
  attachmentId: number | null,
) {
  return api<{ ok: boolean }>(`/workspace/${workspaceId}/cards/${cardId}/cover`, {
    method: 'PATCH',
    accessToken,
    json: { attachmentId },
  });
}

export function formatAttachmentSize(bytes: number | null): string {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
