export function resolveCardRewardUserId(
  assigneeId: number | null | undefined,
  actorUserId: number,
): number {
  return assigneeId ?? actorUserId;
}
