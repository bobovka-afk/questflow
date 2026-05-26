import { CHECKIN_STREAK_MILESTONES } from './lib/checkinStreakMilestones';
import { dayLabelRu } from './lib/checkinStreakProgress';
import { STREAK_LABEL } from './lib/gamificationCopy';

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
          return (
            <li
              key={m.days}
              className={
                completed
                  ? 'trello-streak-milestones-item trello-streak-milestones-item--completed'
                  : 'trello-streak-milestones-item'
              }
            >
              <span className="trello-streak-milestones-item-marker" aria-hidden>
                {completed ? '✓' : '○'}
              </span>
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
