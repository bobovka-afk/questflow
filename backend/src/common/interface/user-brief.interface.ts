export interface UserBrief {
  id: number;
  name: string;
  avatarPath: string | null;
  characterName?: string | null;
  characterAvatarPreset?: string | null;
}
