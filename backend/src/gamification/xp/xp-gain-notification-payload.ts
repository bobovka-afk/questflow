import { XpEventType } from '../../generated/prisma/enums';
import type { XpGrantRewards } from './interface/xp-grant-rewards.interface';

export type XpGainNotificationPayload = {
  xpAmount: number;
  source: XpEventType;
  sources: XpEventType[];
};

export function buildXpGainNotificationPayload(
  rewards: XpGrantRewards,
  eventType: XpEventType,
): XpGainNotificationPayload | null {
  const xpAmount =
    rewards.taskXp + rewards.checkinXp + rewards.streakMilestoneXp;
  if (xpAmount <= 0) return null;

  const sources: XpEventType[] = [];
  if (rewards.taskXp > 0) {
    sources.push(eventType);
  }
  if (rewards.checkinXp > 0) {
    sources.push(XpEventType.DAILY_CHECKIN);
  }
  if (rewards.streakMilestoneXp > 0) {
    sources.push(XpEventType.CHECKIN_STREAK);
  }

  const uniqueSources = [...new Set(sources)];

  return {
    xpAmount,
    source: eventType,
    sources: uniqueSources,
  };
}
