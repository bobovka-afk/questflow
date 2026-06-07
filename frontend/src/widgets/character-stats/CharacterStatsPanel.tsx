import type { CharacterDto } from '@entities/character';
import { CHARACTER_HEALTH_MAX, MANA_MAX } from '@entities/reward';
import { healthStatIconUrl, levelStatIconUrl, manaStatIconUrl, xpToastIconUrl } from '@shared/assets/uiAssets';
import { DustIcon } from '@widgets/dust/icon/DustIcon';

type XpToward = {
  atMaxLevel: boolean;
  into?: number;
  needed?: number;
  pct: number;
};

type Props = {
  character: CharacterDto;
  xpToward: XpToward;
  /** full — все статы; sidebar — HP под портретом; detail — 2×2 (уровень/мана, опыт/пыль) */
  variant?: 'full' | 'sidebar' | 'detail';
};

function statVisible(
  variant: 'full' | 'sidebar' | 'detail',
  stat: 'level' | 'xp' | 'health' | 'mana' | 'dust',
): boolean {
  if (variant === 'full') return true;
  if (variant === 'sidebar') return stat === 'health';
  return stat === 'level' || stat === 'xp' || stat === 'mana' || stat === 'dust';
}

export function CharacterStatsPanel({ character, xpToward, variant = 'full' }: Props) {
  const exhausted = character.health <= 0;
  const rowClass =
    variant === 'sidebar'
      ? 'trello-character-stat-row trello-character-stat-row--sidebar'
      : variant === 'detail'
        ? 'trello-character-stat-row trello-character-stat-row--detail'
        : 'trello-character-stat-row';

  return (
    <div
      className={
        exhausted
          ? 'trello-character-stats-panel trello-character-stats-panel--exhausted'
          : 'trello-character-stats-panel'
      }
    >
      {exhausted ? (
        <p className="trello-character-exhausted-banner" role="status">
          Персонаж истощён — доски и карточки доступны; завтра возможен штраф HP за
          неактивность, если не будет XP за день.
        </p>
      ) : null}
      <div className={rowClass}>
        {statVisible(variant, 'level') ? (
        <div className="trello-character-stat-pill trello-character-stat-pill--level">
          <div className="trello-character-stat-label-row">
            <span className="trello-character-stat-label">УРОВЕНЬ</span>
            <img src={levelStatIconUrl()} alt="" className="trello-character-stat-icon" loading="lazy" />
          </div>
          <div
            className="trello-character-stat-meter"
            role="img"
            aria-label={`Уровень ${character.level}`}
          >
            <div
              className="trello-character-stat-bar-fill trello-character-stat-bar-fill--level"
              style={{ width: '100%' }}
              aria-hidden
            />
            <span className="trello-character-stat-meter-value">{character.level}</span>
          </div>
        </div>
        ) : null}
        {statVisible(variant, 'mana') ? (
        <div className="trello-character-stat-pill trello-character-stat-pill--mana">
          <div className="trello-character-stat-label-row">
            <span className="trello-character-stat-label">МАНА</span>
            <img src={manaStatIconUrl()} alt="" className="trello-character-stat-icon" loading="lazy" />
          </div>
          <div
            className="trello-character-stat-meter"
            role="img"
            aria-label={`Мана ${character.manaCurrent ?? 0} из ${MANA_MAX}`}
          >
            <div
              className="trello-character-stat-bar-fill trello-character-stat-bar-fill--mana"
              style={{
                width: `${Math.min(100, Math.round(((character.manaCurrent ?? 0) / MANA_MAX) * 100))}%`,
              }}
              aria-hidden
            />
            <span className="trello-character-stat-meter-value">
              {character.manaCurrent ?? 0}/{MANA_MAX}
            </span>
          </div>
        </div>
        ) : null}
        {statVisible(variant, 'xp') ? (
        <div className="trello-character-stat-pill trello-character-stat-pill--xp">
          <div className="trello-character-stat-label-row">
            <span className="trello-character-stat-label">ОПЫТ</span>
            <img src={xpToastIconUrl()} alt="" className="trello-character-stat-icon" loading="lazy" />
          </div>
          <div
            className="trello-character-stat-meter"
            role="img"
            aria-label={
              xpToward.atMaxLevel
                ? 'Опыт: максимальный уровень'
                : `Опыт ${xpToward.into ?? 0} из ${xpToward.needed ?? 0}`
            }
          >
            <div
              className="trello-character-stat-bar-fill trello-character-stat-bar-fill--xp"
              style={{ width: `${xpToward.pct}%` }}
              aria-hidden
            />
            <span className="trello-character-stat-meter-value trello-character-stat-meter-value--xp">
              {xpToward.atMaxLevel ? (
                <>Макс. уровень</>
              ) : (
                <>
                  {xpToward.into ?? 0} / {xpToward.needed ?? 0}
                </>
              )}
            </span>
          </div>
        </div>
        ) : null}
        {statVisible(variant, 'health') ? (
        <div
          className={
            exhausted
              ? 'trello-character-stat-pill trello-character-stat-pill--health trello-character-stat-pill--health-exhausted'
              : 'trello-character-stat-pill trello-character-stat-pill--health'
          }
        >
          <div className="trello-character-stat-label-row">
            <span className="trello-character-stat-label">ЗДОРОВЬЕ</span>
            <img src={healthStatIconUrl()} alt="" className="trello-character-stat-icon" loading="lazy" />
          </div>
          <div
            className="trello-character-stat-meter"
            role="img"
            aria-label={`Здоровье ${character.health}`}
          >
            <div
              className="trello-character-stat-bar-fill trello-character-stat-bar-fill--health"
              style={{
                width: `${Math.min(100, Math.round((character.health / CHARACTER_HEALTH_MAX) * 100))}%`,
              }}
              aria-hidden
            />
            <span className="trello-character-stat-meter-value">{character.health}</span>
          </div>
        </div>
        ) : null}
        {statVisible(variant, 'dust') ? (
        <div className="trello-character-stat-pill trello-character-stat-pill--dust">
          <div className="trello-character-stat-label-row">
            <span className="trello-character-stat-label">ПЫЛЬ</span>
            <DustIcon size={40} className="trello-character-stat-icon" />
          </div>
          <div className="trello-character-stat-meter trello-character-stat-meter--dust" role="img" aria-label={`Пыль ${character.dust}`}>
            <span className="trello-character-stat-meter-value trello-character-stat-meter-value--dust">
              {character.dust}
            </span>
          </div>
        </div>
        ) : null}
      </div>
    </div>
  );
}
