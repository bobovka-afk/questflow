import { CHECKIN_STREAK_MILESTONES } from './lib/checkinStreakMilestones';
import { STREAK_LABEL } from './lib/gamificationCopy';
import { DUST_FOR_DUPLICATE_BY_TIER, type ChestTier } from './lib/quests';
import {
  CHARACTER_GRACE_PERIOD_HOURS,
  CHARACTER_HEALTH_MAX,
  DAILY_TASK_XP_COMPLETIONS_MAX,
  DEFAULT_GAME_DAY_TZ,
  HP_GAIN_PER_XP_EVENT,
  HP_INACTIVITY_PENALTY,
  XP_DAILY_CHECKIN,
  XP_PER_TASK_COMPLETED,
} from './lib/xpRewards';

const DUST_SHOP_COSTS: { tier: ChestTier; cost: number }[] = [
  { tier: 'COMMON', cost: 50 },
  { tier: 'RARE', cost: 120 },
  { tier: 'EPIC', cost: 250 },
];

const DUST_DUPLICATE_LINES = (['COMMON', 'RARE', 'EPIC'] as const).map(
  (tier) => `${tier === 'COMMON' ? 'обычной' : tier === 'RARE' ? 'редкой' : 'эпической'} — ${DUST_FOR_DUPLICATE_BY_TIER[tier]}`,
);

type Props = {
  className?: string;
};

export function GamificationGuide(props: Props) {
  const milestoneDays = CHECKIN_STREAK_MILESTONES.map((m) => m.days).join(', ');
  const milestoneXp = CHECKIN_STREAK_MILESTONES.map((m) => `+${m.xp}`).join(', ');
  const dustShopLine = DUST_SHOP_COSTS.map((o) => `${o.cost} (${o.tier.toLowerCase()})`).join(', ');

  return (
    <div className={props.className ?? 'trello-character-guide'}>
      <ul>
        <li>
          <strong>Один персонаж на аккаунт.</strong> Прогресс (опыт, квесты, сундуки) учитывает
          активность во всех рабочих пространствах. Без персонажа награды не начисляются.
        </li>
        <li>
          <strong>Игровые сутки.</strong> Лимиты и серия считаются по календарному дню в часовом
          поясе сервера (<code>{DEFAULT_GAME_DAY_TZ}</code> по умолчанию, задаётся в{' '}
          <code>GAME_DAY_TZ</code>). Сброс счётчика XP за карточки — в полночь этого пояса.
        </li>
        <li>
          <strong>Опыт за карточки.</strong> За первое закрытие карточки (перевод в «выполнено»){' '}
          <strong>+{XP_PER_TASK_COMPLETED} XP</strong> получает персонаж исполнителя; если
          исполнитель не назначен — персонаж того, кто закрыл карточку. Повторное закрытие той же
          карточки опыт не даёт.
        </li>
        <li>
          <strong>Лимит в день.</strong> Опыт за закрытие карточек начисляется не более{' '}
          <strong>{DAILY_TASK_XP_COMPLETIONS_MAX}</strong> раз в сутки на одного персонажа; после
          лимита карточки по-прежнему закрываются, без XP.
        </li>
        <li>
          <strong>{STREAK_LABEL} за день.</strong> При первом начислении опыта за игровой день
          (обычно первая закрытая карточка) автоматически засчитывается {STREAK_LABEL}{' '}
          <strong>+{XP_DAILY_CHECKIN} XP</strong> и растёт счётчик 🔥. Отдельная кнопка не нужна;
          дублирующий запрос чекина за тот же день не даст XP повторно.
        </li>
        <li>
          <strong>Пороги {STREAK_LABEL.toLowerCase()}.</strong> При {milestoneDays} днях подряд —
          бонус XP ({milestoneXp}); начисляется один раз за каждый порог.
        </li>
        <li>
          <strong>Опыт и уровень.</strong> Полоска XP на профиле — доля до следующего уровня по
          той же кривой, что на сервере. Уровни 1–100.
        </li>
        <li>
          <strong>Здоровье (HP).</strong> Максимум {CHARACTER_HEALTH_MAX}. За каждое начисление XP
          за закрытие карточки <strong>+{HP_GAIN_PER_XP_EVENT} HP</strong> (чекин и бонусы серии HP
          не дают). Если вчера не было активности — <strong>−{HP_INACTIVITY_PENALTY} HP</strong>{' '}
          (раз в сутки). Новый персонаж: без штрафа первые {CHARACTER_GRACE_PERIOD_HOURS} ч. HP = 0
          не блокирует доски — только отображение статуса.
        </li>
        <li>
          <strong>Квесты.</strong> Дневные и недельные задания (карточки, комментарии, серия,
          активность). За каждый выполненный квест — отдельный сундук; откройте его в блоке ниже.
          Зачёт карточек — как у XP (исполнитель или закрывший).
        </li>
        <li>
          <strong>Сундуки и косметика.</strong> Из сундука — рамка, фон, значок или редкий образ
          мага. Косметика без статов: не влияет на XP и HP. Рамки, фоны и значки — «Надеть» в
          инвентаре. Квестовый образ мага — кнопка «Применить образ» после открытия или в
          редактировании персонажа (нужно владение предметом; женским персонажам выпадает женский
          вариант).
        </li>
        <li>
          <strong>Пыль.</strong> Дубликат косметики → пыль: {DUST_DUPLICATE_LINES.join('; ')}.
          Обмен на сундук: {dustShopLine} пыли.
        </li>
        <li>
          <strong>Достижения.</strong> Разовые награды за карточки, комментарии, серию, уровень,
          квесты и сундуки; часть даёт бонусную пыль.
        </li>
        <li>
          <strong>Смена облика.</strong> «Редактировать» под портретом — имя, пол и один из шести
          базовых классов. Фото аккаунта (круг в шапке) — отдельно, в «Профиль → Аккаунт».
        </li>
      </ul>
    </div>
  );
}
