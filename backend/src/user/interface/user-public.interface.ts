export interface UserPublic {
  id: number;
  email: string;
  name: string;
  username: string | null;
  avatarPath: string | null;
  hasPassword: boolean;
  createdAt: Date;
}
