import { SpaLink } from './lib/navigation';
import { STREAK_LABEL } from './lib/gamificationCopy';
import {
  DAILY_TASK_XP_COMPLETIONS_MAX,
  XP_DAILY_CHECKIN,
  XP_PER_TASK_COMPLETED,
} from './lib/xpRewards';

type Props = {
  open: boolean;
  onClose: () => void;
};

export function GamificationIntroModal(props: Props) {
  if (!props.open) return null;

  return (
    <div
      className="trello-modal-backdrop"
      role="presentation"
      onClick={props.onClose}
    >
      <div
        className="trello-modal trello-gamification-intro-modal"
        role="dialog"
        aria-modal
        aria-labelledby="gamification-intro-subtitle"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="trello-modal-close trello-gamification-intro-close"
          onClick={props.onClose}
          aria-label="Закрыть"
        >
          ×
        </button>

        <div className="trello-modal-body trello-gamification-intro-body">
          <section className="trello-gamification-intro-block">
            <p className="trello-gamification-intro-text">
              <strong>Questflow</strong> — доски и карточки для команд и личных дел: задачи,
              сроки, исполнители и комментарии в одном месте. Создайте рабочее пространство,
              пригласите участников и ведите проекты так же удобно, как в привычных
              таск-трекерах.
            </p>
          </section>

          <section className="trello-gamification-intro-block trello-gamification-intro-block--gamification">
            <h3 className="trello-gamification-intro-subtitle" id="gamification-intro-subtitle">
              Геймификация
            </h3>
            <p className="trello-gamification-intro-text">
              Поверх обычной работы с досками — лёгкий <strong>RPG</strong>-слой: персонаж с
              уровнем, опытом, здоровьем и серией дней, как в ролевой игре. Прогресс виден
              сразу, а регулярная активность поощряется наградами.
            </p>
            <ul className="trello-gamification-intro-list">
              <li>
                Закрывайте карточки — до <strong>{DAILY_TASK_XP_COMPLETIONS_MAX}</strong> раз в сутки по{' '}
                <strong>+{XP_PER_TASK_COMPLETED} XP</strong> (исполнителю или закрывшему).
              </li>
              <li>
                {STREAK_LABEL} за день — <strong>+{XP_DAILY_CHECKIN} XP</strong> при первой награде за
                сутки; длинная серия даёт бонусы XP.
              </li>
              <li>
                Квесты, сундуки и косметика без влияния на силу персонажа — только внешний вид и
                коллекция.
              </li>
              <li>Без персонажа награды не начисляются — создайте героя один раз.</li>
              <li>Подробные правила — в профиле персонажа, блок «Как это работает».</li>
            </ul>
          </section>
        </div>

        <div className="trello-modal-foot trello-modal-foot-center trello-gamification-intro-foot">
          <button type="button" className="trello-btn trello-btn-ghost" onClick={props.onClose}>
            Позже
          </button>
          <SpaLink
            className="trello-btn trello-btn-primary"
            to="/profile/character"
            onClick={props.onClose}
          >
            Создать персонажа
          </SpaLink>
        </div>
      </div>
    </div>
  );
}
