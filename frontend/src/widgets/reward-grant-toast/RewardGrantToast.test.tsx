import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckinRewardToast, TaskRewardToast } from './RewardGrantToast';

describe('RewardGrantToast', () => {
  it('renders checkin hero with streak label, xp and milestones', () => {
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

    expect(screen.getByText('7-й день подряд')).toBeInTheDocument();
    expect(screen.getByText(/\+300 XP/)).toBeInTheDocument();
    expect(screen.getByText(/Порог серии/i)).toBeInTheDocument();
  });

  it('renders task hero with xp and hp', () => {
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

    expect(screen.getByText('За закрытие карточки')).toBeInTheDocument();
    expect(screen.getByText(/\+100 XP/)).toBeInTheDocument();
    expect(screen.getByText(/\+5 HP/)).toBeInTheDocument();
  });
});
