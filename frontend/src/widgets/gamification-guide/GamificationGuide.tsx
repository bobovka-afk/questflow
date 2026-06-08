import { CHECKIN_STREAK_MILESTONES } from '@entities/character/lib/checkinStreakMilestones';
import { STREAK_LABEL } from '@entities/reward';
import { DUST_FOR_DUPLICATE_BY_TIER, type ChestTier } from '@entities/quest';
import {
  CHARACTER_GRACE_PERIOD_HOURS,
  CHARACTER_HEALTH_MAX,
  DAILY_TASK_XP_COMPLETIONS_MAX,
  DEFAULT_GAME_DAY_TZ,
  HP_GAIN_PER_XP_EVENT,
  HP_INACTIVITY_PENALTY,
  XP_DAILY_CHECKIN,
  XP_PER_TASK_COMPLETED,
} from '@entities/reward';
import { GameDayHint } from '@widgets/game-day-hint/GameDayHint';

const DUST_SHOP_COSTS: { tier: ChestTier; cost: number }[] = [
  { tier: 'COMMON', cost: 50 },
  { tier: 'RARE', cost: 120 },
  { tier: 'EPIC', cost: 250 },
];

const DUST_DUPLICATE_LINES = (['COMMON', 'RARE', 'EPIC'] as const).map(
  (tier) =>
    `${tier === 'COMMON' ? 'обычной' : tier === 'RARE' ? 'редкой' : 'эпической'} — ${DUST_FOR_DUPLICATE_BY_TIER[tier]}`,
);

type Props = {
  className?: string;
};

export function GamificationGuide(props: Props) {
  const milestoneDays = CHECKIN_STREAK_MILESTONES.map((m) => m.days).join(', ');
  const milestoneXp = CHECKIN_STREAK_MILESTONES.map((m) => `+${m.xp}`).join(', ');
  const dustShopLine = DUST_SHOP_COSTS.map((o) => `${o.cost} (${o.tier.toLowerCase()})`).join(', ');

  return (
    <div className={[props.className ?? 'trello-character-guide', 'trello-character-guide--accordion']
      .filter(Boolean)
      .join(' ')}
    >
      <details className="trello-character-guide-section" open>
        <summary>Персонаж и сутки</summary>
        <div className="trello-character-guide-section-body">
          <p>
            <strong>Один персонаж на аккаунт.</strong> Прогресс (опыт, квесты, сундуки) учитывает
            активность во всех рабочих пространствах. Без персонажа награды не начисляются.
          </p>
          <p>
            <strong>Игровые сутки.</strong> Лимиты и серия считаются по календарному дню в часовом
            поясе сервера (<code>{DEFAULT_GAME_DAY_TZ}</code> по умолчанию, задаётся в{' '}
            <code>GAME_DAY_TZ</code>). Сброс счётчика XP за карточки — в полночь этого пояса.
            <GameDayHint className="trello-game-day-hint trello-game-day-hint--guide" />
          </p>
        </div>
      </details>

      <details className="trello-character-guide-section">
        <summary>XP и лимиты</summary>
        <div className="trello-character-guide-section-body">
          <p>
            <strong>Опыт за карточки.</strong> За первое закрытие карточки (перевод в «выполнено»){' '}
            <strong>+{XP_PER_TASK_COMPLETED} XP</strong> получает персонаж исполнителя; если
            исполнитель не назначен — персонаж того, кто закрыл карточку. Повторное закрытие той же
            карточки опыт не даёт.
          </p>
          <p>
            <strong>Лимит в день.</strong> Опыт за закрытие карточек начисляется не более{' '}
            <strong>{DAILY_TASK_XP_COMPLETIONS_MAX}</strong> раз в сутки на одного персонажа; после
            лимита карточки по-прежнему закрываются, без XP.
          </p>
        </div>
      </details>

      <details className="trello-character-guide-section">
        <summary>Серия, уровень и HP</summary>
        <div className="trello-character-guide-section-body">
          <p>
            <strong>{STREAK_LABEL} за день.</strong> При первом начислении опыта за игровой день
            (обычно первая закрытая карточка) автоматически засчитывается {STREAK_LABEL}{' '}
            <strong>+{XP_DAILY_CHECKIN} XP</strong> и растёт счётчик 🔥. Отдельная кнопка не нужна;
            дублирующий запрос чекина за тот же день не даст XP повторно.
          </p>
          <p>
            <strong>Пороги {STREAK_LABEL.toLowerCase()}.</strong> При {milestoneDays} днях подряд —
            бонус XP ({milestoneXp}); начисляется один раз за каждый порог.
          </p>
          <p>
            <strong>Опыт и уровень.</strong> Полоска XP на профиле — доля до следующего уровня по
            той же кривой, что на сервере. Уровни 1–100.
          </p>
          <p>
            <strong>Здоровье (HP).</strong> Максимум {CHARACTER_HEALTH_MAX}. За каждое начисление XP
            за закрытие карточки <strong>+{HP_GAIN_PER_XP_EVENT} HP</strong> (чекин и бонусы серии HP
            не дают). Если вчера не было активности — <strong>−{HP_INACTIVITY_PENALTY} HP</strong>{' '}
            (раз в сутки). Новый персонаж: без штрафа первые {CHARACTER_GRACE_PERIOD_HOURS} ч. HP = 0
            не блокирует доски — только отображение статуса.
          </p>
        </div>
      </details>

      <details className="trello-character-guide-section">
        <summary>Квесты, сундуки и пыль</summary>
        <div className="trello-character-guide-section-body">
          <p>
            <strong>Квесты.</strong> Дневные и недельные задания (карточки, комментарии, серия,
            активность). За каждый выполненный квест — отдельный сундук; откройте его в блоке ниже.
            Зачёт карточек — как у XP (исполнитель или закрывший).
          </p>
          <p>
            <strong>Сундуки и косметика.</strong> Из сундука — рамка, фон, значок или редкий образ
            мага. Косметика без статов: не влияет на XP и HP. Рамки, фоны и значки — «Надеть» в
            инвентаре. Квестовый образ мага — кнопка «Применить образ» после открытия или в
            редактировании персонажа (нужно владение предметом; женским персонажам выпадает женский
            вариант).
          </p>
          <p>
            <strong>Пыль.</strong> Дубликат косметики → пыль: {DUST_DUPLICATE_LINES.join('; ')}.
            Обмен на сундук: {dustShopLine} пыли.
          </p>
        </div>
      </details>

      <details className="trello-character-guide-section">
        <summary>Достижения и облик</summary>
        <div className="trello-character-guide-section-body">
          <p>
            <strong>Достижения.</strong> Разовые награды за карточки, серию, уровень,
            квесты и коллекцию; часть даёт бонусную пыль.
          </p>
          <p>
            <strong>Смена облика.</strong> «Редактировать» под портретом — имя, пол и один из шести
            базовых классов. Фото аккаунта (круг в шапке) — отдельно, в «Профиль → Аккаунт».
          </p>
        </div>
      </details>
    </div>
  );
}
