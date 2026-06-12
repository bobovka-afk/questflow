export type ActivityUserBrief = {
  id: number;
  name: string;
  avatarPath?: string | null;
  characterName?: string | null;
  characterAvatarPreset?: string | null;
};

export function activityUserDisplayName(
  user: Pick<ActivityUserBrief, 'name' | 'characterName'>,
): string {
  return user.characterName?.trim() || user.name;
}
