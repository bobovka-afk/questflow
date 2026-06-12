import { api } from '@shared/api';

export type CardCoverDisplayMode = 'NONE' | 'BANNER' | 'FULL';

/** Partial card fields updated by color cover (instant UI patch). */
export type CardCoverPatch = {
  coverColorPreset?: string | null;
  coverDisplayMode?: CardCoverDisplayMode;
  coverImageUrl?: string | null;
};

export function setCardColorCover(
  accessToken: string,
  workspaceId: number,
  cardId: number,
  colorPreset: string | null,
  displayMode: CardCoverDisplayMode,
) {
  return api<{ ok: boolean }>(
    `/workspace/${workspaceId}/cards/${cardId}/cover-color`,
    {
      method: 'PATCH',
      accessToken,
      json: { colorPreset, displayMode },
    },
  );
}

export function archiveCard(
  accessToken: string,
  workspaceId: number,
  cardId: number,
) {
  return api<{ ok: boolean }>(
    `/workspace/${workspaceId}/cards/${cardId}/archive`,
    {
      method: 'PATCH',
      accessToken,
    },
  );
}
