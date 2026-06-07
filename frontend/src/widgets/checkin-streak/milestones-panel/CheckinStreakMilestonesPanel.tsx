import { CHECKIN_STREAK_MILESTONES } from '@entities/character/lib/checkinStreakMilestones';
import { dayLabelRu } from '@entities/character/lib/checkinStreakProgress';
import {
  achievementIconUrl,
  ACHIEVEMENT_ICON_LIST_SIZE,
} from '@entities/achievement/lib/achievementAssets';
import { STREAK_LABEL } from '@entities/reward';

const STREAK_MILESTONE_ICON_KEY: Record<number, string> = {
  7: 'streak_7',
  14: 'streak_14',
  30: 'streak_30',
};

type Props = {
  streak: number;
};

export function CheckinStreakMilestonesPanel(props: Props) {
  const streak = props.streak ?? 0;

  return (
    <section
      className="trello-streak-milestones"
      aria-label={`Награды за ${STREAK_LABEL.toLowerCase()}`}
    >
      <ul className="trello-streak-milestones-list">
        {CHECKIN_STREAK_MILESTONES.map((m) => {
          const completed = streak >= m.days;
          const iconKey = STREAK_MILESTONE_ICON_KEY[m.days];
          return (
            <li
              key={m.days}
              className={
                completed
                  ? 'trello-streak-milestones-item trello-streak-milestones-item--completed'
                  : 'trello-streak-milestones-item'
              }
            >
              {iconKey ? (
                <img
                  src={achievementIconUrl(iconKey)}
                  alt=""
                  width={ACHIEVEMENT_ICON_LIST_SIZE}
                  height={ACHIEVEMENT_ICON_LIST_SIZE}
                  className={
                    completed
                      ? 'trello-streak-milestones-item-icon'
                      : 'trello-streak-milestones-item-icon trello-streak-milestones-item-icon--locked'
                  }
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <span className="trello-streak-milestones-item-marker" aria-hidden>
                  {completed ? '✓' : '○'}
                </span>
              )}
              <span className="trello-streak-milestones-item-days">
                {m.days} {dayLabelRu(m.days)}
              </span>
              <span className="trello-streak-milestones-item-xp">+{m.xp} XP</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
