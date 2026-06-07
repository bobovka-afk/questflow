import { API_URL } from '@shared/api';

export const BOSS_ICON_SIZE = 64;
export const BOSS_ICON_SIZE_SM = 48;
/** Boss picker grid — large portrait for readability */
export const BOSS_ICON_SIZE_PICK = 128;

const BOSS_ICON_FILE_BY_KEY: Record<string, string> = {
  rust_king: 'rust_king.png',
  colossus: 'colossus.png',
  maw_of_void: 'void.png',
};

export function bossIconUrl(bossKey: string): string {
  const file = BOSS_ICON_FILE_BY_KEY[bossKey] ?? `${bossKey}.png`;
  return `${API_URL}/uploads/ui/bosses/${file}`;
}
