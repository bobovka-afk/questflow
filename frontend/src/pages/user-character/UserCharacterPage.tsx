import { useEffect, useMemo, useState } from 'react';
import { api, formatApiError, type ApiError } from '@shared/api';
import { CheckinStreakCounter } from '@widgets/checkin-streak/counter/CheckinStreakCounter';
import { type CharacterDto } from '@entities/character';
import { CharacterPortraitWithFrame } from '@widgets/character-portrait/CharacterPortraitWithFrame';
import { CHARACTER_HEALTH_MAX } from '@entities/reward';
import { getCharacterXpTowardNext } from '@entities/character/lib/level-curve';
import { SpaLink } from '@shared/lib/navigation';
import { AppLogo } from '@shared/ui/app-logo/AppLogo';
import { navigate } from '@shared/lib/navigation-core';
import { userProfilePath } from '@entities/user';
import { SocialUserBlockButton } from '@widgets/social-user-block/SocialUserBlockButton';
import {
  acceptFriendRequest,
  fetchUserRelation,
  formatFriendCode,
  sendFriendRequest,
  type UserRelationView,
} from '@entities/social';

type Props = {
  accessToken: string;
  userId: number;
  currentUserId: number | null;
};

export function UserCharacterPage({ accessToken, userId, currentUserId }: Props) {
  const [character, setCharacter] = useState<CharacterDto | null>(null);
  const [loadPhase, setLoadPhase] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [relation, setRelation] = useState<UserRelationView | null>(null);
  const [socialBusy, setSocialBusy] = useState(false);
  const [socialMsg, setSocialMsg] = useState<string | null>(null);

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
        if (err.status === 403 && err.code === 'CHARACTER_VIEW_DISABLED') {
          setCharacter(null);
          setLoadPhase('error');
          setLoadError(formatApiError(e));
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

  useEffect(() => {
    if (isSelf || loadPhase !== 'ready') return;
    let cancelled = false;
    void (async () => {
      try {
        const rel = await fetchUserRelation(accessToken, userId);
        if (!cancelled) setRelation(rel);
      } catch {
        if (!cancelled) setRelation(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, userId, isSelf, loadPhase]);

  const xpToward = useMemo(() => {
    if (!character) {
      return { atMaxLevel: false, into: 0, needed: 0, pct: 0 } as const;
    }
    return getCharacterXpTowardNext(character.level, character.currentXp);
  }, [character]);

  function goBack() {
    navigate(userProfilePath(userId));
  }

  function openMessages() {
    navigate(`/profile/character?with=${userId}`);
  }

  const socialBlocked =
    relation?.blockedByMe === true || relation?.blockedByThem === true;

  async function handleAddFriend() {
    if (!character?.friendCode) return;
    setSocialBusy(true);
    setSocialMsg(null);
    try {
      if (relation?.incomingRequestId != null) {
        await acceptFriendRequest(accessToken, relation.incomingRequestId);
      } else {
        await sendFriendRequest(accessToken, character.friendCode);
      }
      const rel = await fetchUserRelation(accessToken, userId);
      setRelation(rel);
    } catch (e) {
      setSocialMsg(formatApiError(e));
    } finally {
      setSocialBusy(false);
    }
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
                <AppLogo />
                <span className="trello-top-left-brand-text">Questflow</span>
              </SpaLink>
              <button type="button" className="trello-btn trello-btn-topbar-nav trello-topbar-back-btn" onClick={goBack}>
                Назад
              </button>
            </div>
            <h1 className="trello-topbar-stripe-center">Персонаж</h1>
            <div className="trello-topbar-actions" />
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
                <AppLogo />
                <span className="trello-top-left-brand-text">Questflow</span>
              </SpaLink>
              <button type="button" className="trello-btn trello-btn-topbar-nav trello-topbar-back-btn" onClick={goBack}>
                Назад
              </button>
            </div>
            <h1 className="trello-topbar-stripe-center">Персонаж</h1>
            <div className="trello-topbar-actions" />
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
              <AppLogo />
              <span className="trello-top-left-brand-text">Questflow</span>
            </SpaLink>
            <button type="button" className="trello-btn trello-btn-topbar-nav trello-topbar-back-btn" onClick={goBack}>
              Профиль
            </button>
          </div>
          <h1 className="trello-topbar-stripe-center trello-topbar-stripe-center--ellipsis" title={character.name}>
            {character.name}
          </h1>
          <div className="trello-topbar-actions" />
        </header>

        {socialMsg && <div className="trello-banner trello-banner-error">{socialMsg}</div>}

        <section className="trello-character-profile">
          <div className="trello-character-profile-hero trello-character-profile-hero--stacked">
            <div className="trello-character-profile-portrait-column">
              <div className="trello-character-profile-portrait-wrap trello-character-profile-portrait-wrap--square">
                <CharacterPortraitWithFrame
                  avatarPreset={character.avatarPreset}
                  frameKey={character.equippedPortraitFrameKey}
                  profileBackgroundKey={character.equippedProfileBackgroundKey}
                />
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
          {relation && (
            <div className="trello-social-user-actions">
              {character.friendCode != null && (
                <span className="trello-muted trello-social-user-code">
                  ID: {formatFriendCode(character.friendCode)}
                </span>
              )}
              {!socialBlocked && !relation.isFriend && !relation.outgoingRequestId && (
                <button
                  type="button"
                  className="trello-btn trello-btn-primary trello-btn-sm"
                  disabled={socialBusy || character.friendCode == null}
                  onClick={() => void handleAddFriend()}
                >
                  {relation.incomingRequestId != null
                    ? 'Принять заявку'
                    : 'Добавить в друзья'}
                </button>
              )}
              {!socialBlocked && relation.outgoingRequestId != null && !relation.isFriend && (
                <span className="trello-muted">Заявка отправлена</span>
              )}
              {!socialBlocked && relation.isFriend && (
                <span className="trello-muted">В друзьях</span>
              )}
              {relation.canMessage && (
                <button
                  type="button"
                  className="trello-btn trello-btn-ghost trello-btn-sm"
                  onClick={openMessages}
                >
                  Написать
                </button>
              )}
              <SocialUserBlockButton
                accessToken={accessToken}
                userId={userId}
                relation={relation}
                onRelationChange={setRelation}
                onError={setSocialMsg}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
