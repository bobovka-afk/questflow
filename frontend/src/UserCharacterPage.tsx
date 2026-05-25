import { useEffect, useMemo, useState } from 'react';
import { api, formatApiError, type ApiError } from './lib/api';
import { CheckinStreakCounter } from './CheckinStreakCounter';
import { type CharacterDto, characterPortraitUrl } from './lib/character';
import { CHARACTER_HEALTH_MAX } from './lib/xpRewards';
import { getCharacterXpTowardNext } from './lib/level-curve';
import { navigate, SpaLink } from './lib/navigation';
import { userProfilePath } from './lib/avatar';
import { ProfileToolbarAnchor } from './profileToolbarOutlet';

type Props = {
  accessToken: string;
  userId: number;
  currentUserId: number | null;
};

export function UserCharacterPage({ accessToken, userId, currentUserId }: Props) {
  const [character, setCharacter] = useState<CharacterDto | null>(null);
  const [loadPhase, setLoadPhase] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);

  const isSelf = currentUserId != null && userId === currentUserId;

  useEffect(() => {
    if (isSelf) {
      navigate('/profile/character');
    }
  }, [isSelf]);

  useEffect(() => {
    if (isSelf) return;
    let cancelled = false;
    void (async () => {
      setLoadPhase('loading');
      setLoadError(null);
      try {
        const c = await api<CharacterDto>(`/character/user/${userId}`, {
          method: 'GET',
          accessToken,
        });
        if (!cancelled) {
          setCharacter(c);
          setLoadPhase('ready');
        }
      } catch (e) {
        if (cancelled) return;
        const err = e as ApiError;
        if (err.status === 404 && (!err.code || err.code === 'CHARACTER_NOT_FOUND')) {
          setCharacter(null);
          setLoadPhase('missing');
          return;
        }
        setLoadPhase('error');
        setLoadError(formatApiError(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, userId, isSelf]);

  const xpToward = useMemo(() => {
    if (!character) {
      return { atMaxLevel: false, into: 0, needed: 0, pct: 0 } as const;
    }
    return getCharacterXpTowardNext(character.level, character.currentXp);
  }, [character]);

  const portrait = character ? characterPortraitUrl(character.avatarPreset) : '';

  function goBack() {
    navigate(userProfilePath(userId));
  }

  if (isSelf) {
    return (
      <div className="trello-app-shell">
        <div className="trello-boards-main trello-character-loading">Загрузка…</div>
      </div>
    );
  }

  if (loadPhase === 'error') {
    return (
      <div className="trello-app-shell">
        <div className="trello-boards-main">
          <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
            <div className="trello-topbar-stripe-left">
              <SpaLink className="trello-top-left-brand trello-top-left-brand--stripe" to="/workspaces">
                <span className="trello-logo" aria-hidden />
                <span className="trello-top-left-brand-text">Questflow</span>
              </SpaLink>
            </div>
            <h1 className="trello-topbar-stripe-center">Персонаж</h1>
            <div className="trello-topbar-actions">
              <button type="button" className="trello-btn trello-btn-ghost" onClick={goBack}>
                Назад
              </button>
              <ProfileToolbarAnchor />
            </div>
          </header>
          <section className="trello-panel">
            <div className="trello-empty" style={{ padding: 24 }}>
              <p>{loadError ?? 'Не удалось загрузить персонажа.'}</p>
              <button type="button" className="trello-btn trello-btn-primary" style={{ marginTop: 16 }} onClick={goBack}>
                К профилю
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (loadPhase === 'missing') {
    return (
      <div className="trello-app-shell">
        <div className="trello-boards-main">
          <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
            <div className="trello-topbar-stripe-left">
              <SpaLink className="trello-top-left-brand trello-top-left-brand--stripe" to="/workspaces">
                <span className="trello-logo" aria-hidden />
                <span className="trello-top-left-brand-text">Questflow</span>
              </SpaLink>
            </div>
            <h1 className="trello-topbar-stripe-center">Персонаж</h1>
            <div className="trello-topbar-actions">
              <button type="button" className="trello-btn trello-btn-ghost" onClick={goBack}>
                Назад
              </button>
              <ProfileToolbarAnchor />
            </div>
          </header>
          <section className="trello-panel">
            <div className="trello-empty" style={{ padding: 24 }}>
              У участника пока нет персонажа.
              <button type="button" className="trello-btn trello-btn-primary" style={{ marginTop: 16, display: 'block' }} onClick={goBack}>
                К профилю
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (loadPhase === 'loading' || !character) {
    return (
      <div className="trello-app-shell">
        <div className="trello-boards-main trello-character-loading">Загрузка персонажа…</div>
      </div>
    );
  }

  return (
    <div className="trello-app-shell">
      <div className="trello-boards-main">
        <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
          <div className="trello-topbar-stripe-left">
            <SpaLink className="trello-top-left-brand trello-top-left-brand--stripe" to="/workspaces">
              <span className="trello-logo" aria-hidden />
              <span className="trello-top-left-brand-text">Questflow</span>
            </SpaLink>
          </div>
          <h1 className="trello-topbar-stripe-center trello-topbar-stripe-center--ellipsis" title={character.name}>
            {character.name}
          </h1>
          <div className="trello-topbar-actions">
            <button type="button" className="trello-btn trello-btn-ghost" onClick={goBack}>
              Профиль
            </button>
            <ProfileToolbarAnchor />
          </div>
        </header>

        <section className="trello-character-profile">
          <div className="trello-character-profile-hero trello-character-profile-hero--stacked">
            <div className="trello-character-profile-portrait-column">
              <div className="trello-character-profile-portrait-wrap trello-character-profile-portrait-wrap--square">
                <img src={portrait} alt="" className="trello-character-profile-portrait" loading="lazy" />
              </div>
            </div>
            <div className="trello-character-profile-info-col">
              <div className="trello-character-streak-block">
                <CheckinStreakCounter streak={character.checkinStreak ?? 0} size="profile" />
              </div>
              <div className="trello-character-stat-row">
                <div className="trello-character-stat-pill trello-character-stat-pill--level">
                  <span className="trello-character-stat-label">Уровень</span>
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
                <div className="trello-character-stat-pill trello-character-stat-pill--xp">
                  <span className="trello-character-stat-label">Опыт</span>
                  <div
                    className="trello-character-stat-meter"
                    role="img"
                    aria-label={
                      xpToward.atMaxLevel
                        ? 'Опыт: максимальный уровень'
                        : `Опыт ${xpToward.into} из ${xpToward.needed}`
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
                          {xpToward.into} / {xpToward.needed}
                        </>
                      )}
                    </span>
                  </div>
                </div>
                <div className="trello-character-stat-pill trello-character-stat-pill--health">
                  <span className="trello-character-stat-label">Здоровье</span>
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
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
