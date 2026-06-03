export interface UserProfileView {
  id: number;
  name: string;
  avatarPath: string | null;
  createdAt: Date;
  allowCharacterView: boolean;
  friendCode: number | null;
}
