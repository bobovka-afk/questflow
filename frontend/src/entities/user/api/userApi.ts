import { api } from '@shared/api';

export type UserMeDto = {
  id: number;
  email: string;
  name: string;
  username: string | null;
  avatarPath: string | null;
  hasPassword: boolean;
  createdAt: string;
};

export function updateUsername(accessToken: string, username: string) {
  return api<UserMeDto>('/user/me/username', {
    method: 'PATCH',
    accessToken,
    json: { username },
  });
}
