import { describe, expect, it } from 'vitest';
import {
  countUnreadNotifications,
  matchesNotificationFilter,
  notificationCategory,
  notificationDisplay,
  notificationTypeBadge,
  type NotificationRow,
} from './notificationHelpers';

function row(type: string, read = false): NotificationRow {
  return {
    id: 1,
    type,
    payload: {},
    readAt: read ? '2026-06-08T12:00:00.000Z' : null,
    createdAt: '2026-06-08T12:00:00.000Z',
  };
}

describe('notificationCategory', () => {
  it('maps task notifications', () => {
    expect(notificationCategory('MENTION')).toBe('tasks');
    expect(notificationCategory('CARD_ASSIGNED')).toBe('tasks');
  });

  it('maps rpg notifications', () => {
    expect(notificationCategory('QUEST_COMPLETED')).toBe('rpg');
    expect(notificationCategory('ACHIEVEMENT')).toBe('rpg');
  });

  it('maps social notifications', () => {
    expect(notificationCategory('FRIEND_REQUEST')).toBe('social');
    expect(notificationCategory('PARTY_RAID_INVITE')).toBe('social');
  });
});

describe('matchesNotificationFilter', () => {
  it('filters by category', () => {
    const mention = row('MENTION');
    expect(matchesNotificationFilter(mention, 'all')).toBe(true);
    expect(matchesNotificationFilter(mention, 'tasks')).toBe(true);
    expect(matchesNotificationFilter(mention, 'rpg')).toBe(false);
  });

  it('filters unread only', () => {
    const unread = row('MENTION');
    const read = row('MENTION', true);
    expect(matchesNotificationFilter(unread, 'unread')).toBe(true);
    expect(matchesNotificationFilter(read, 'unread')).toBe(false);
  });
});

describe('countUnreadNotifications', () => {
  it('counts unread rows for filter', () => {
    const rows = [row('MENTION'), row('QUEST_COMPLETED', true), row('QUEST_COMPLETED')];
    expect(countUnreadNotifications(rows, 'all')).toBe(2);
    expect(countUnreadNotifications(rows, 'tasks')).toBe(1);
    expect(countUnreadNotifications(rows, 'rpg')).toBe(1);
  });
});

describe('notificationTypeBadge', () => {
  it('returns badge for known types', () => {
    expect(notificationTypeBadge('MENTION')).toBe('@');
    expect(notificationTypeBadge('QUEST_COMPLETED')).toBe('📜');
  });
});

describe('notificationDisplay', () => {
  it('splits chest notification into action and reason', () => {
    const display = notificationDisplay({
      ...row('CHEST_READY'),
      payload: { questTitle: 'Серия за день' },
    });
    expect(display.action).toBe('Сундук получен');
    expect(display.reason).toBe('За «Серия за день»');
  });

  it('formats xp gain with source', () => {
    const display = notificationDisplay({
      ...row('XP_GAIN'),
      payload: { xpAmount: 25, source: 'TASK_COMPLETED' },
    });
    expect(display.action).toBe('Получен опыт');
    expect(display.reason).toContain('25 XP');
    expect(display.reason).toContain('За выполненную задачу');
  });
});
