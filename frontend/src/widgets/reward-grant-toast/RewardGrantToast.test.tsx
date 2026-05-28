import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckinRewardToast, TaskRewardToast } from './RewardGrantToast';

describe('RewardGrantToast', () => {
  it('renders checkin reward with summed xp and milestones', () => {
    render(
      <CheckinRewardToast
        toastId={1}
        rewards={{
          taskXp: 0,
          checkinXp: 100,
          hpGained: 0,
          checkinStreak: 7,
          previousCheckinStreak: 6,
          streakIncreased: true,
          streakMilestoneXp: 200,
          streakMilestonesReached: [7],
        }}
      />,
    );

    expect(screen.getByText('300')).toBeInTheDocument();
    expect(screen.getByText(/Порог серии/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Серия: 7/)).toBeInTheDocument();
  });

  it('renders task reward with hp gain', () => {
    render(
      <TaskRewardToast
        toastId={2}
        rewards={{
          taskXp: 100,
          checkinXp: 0,
          hpGained: 5,
          checkinStreak: 0,
          previousCheckinStreak: 0,
          streakIncreased: false,
          streakMilestoneXp: 0,
          streakMilestonesReached: [],
        }}
      />,
    );

    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText(/Здоровье/i)).toBeInTheDocument();
  });
});
