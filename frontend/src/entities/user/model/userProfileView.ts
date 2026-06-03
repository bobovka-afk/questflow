export type UserProfileView = {
  id: number;
  name: string;
  avatarPath: string | null;
  createdAt: string;
  allowCharacterView: boolean;
  friendCode: number | null;
};
