import { describe, expect, it } from 'vitest';
import { allStreakMilestonesReached, buildStreakMilestoneRows, dayLabelRu, getNextStreakMilestone } from './checkinStreakProgress';

describe('checkinStreakProgress', () => {
  it('returns correct russian day labels', () => {
    expect(dayLabelRu(1)).toBe('день');
    expect(dayLabelRu(2)).toBe('дня');
    expect(dayLabelRu(5)).toBe('дней');
    expect(dayLabelRu(21)).toBe('день');
  });

  it('marks next and completed milestones correctly', () => {
    const rows = buildStreakMilestoneRows(8);
    expect(rows[0]?.status).toBe('completed');
    expect(rows[1]?.status).toBe('next');
    expect(rows[1]?.daysRemaining).toBe(6);
    expect(getNextStreakMilestone(14)?.days).toBe(30);
    expect(allStreakMilestonesReached(30)).toBe(true);
  });
});
