import type { Prisma } from '../../generated/prisma/client';
import type { UserBrief } from '../interface/user-brief.interface';

export const userBriefWithCharacterSelect = {
  id: true,
  name: true,
  avatarPath: true,
  character: {
    select: {
      name: true,
      avatarPreset: true,
    },
  },
} satisfies Prisma.UserSelect;

export type UserWithCharacterBriefPayload = Prisma.UserGetPayload<{
  select: typeof userBriefWithCharacterSelect;
}>;

export function toUserBrief(user: UserWithCharacterBriefPayload): UserBrief {
  return {
    id: user.id,
    name: user.name,
    avatarPath: user.avatarPath,
    characterName: user.character?.name ?? null,
    characterAvatarPreset: user.character?.avatarPreset ?? null,
  };
}
