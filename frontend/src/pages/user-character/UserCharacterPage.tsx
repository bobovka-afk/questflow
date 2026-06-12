import { useEffect, useMemo, useState } from 'react';
import { api, formatApiError, type ApiError } from '@shared/api';
import { CharacterStatsPanel } from '@widgets/character-stats/CharacterStatsPanel';
import { UserCharacterProfileFoot } from '@widgets/user-character-profile-foot/UserCharacterProfileFoot';
import { CheckinStreakCounter } from '@widgets/checkin-streak/counter/CheckinStreakCounter';
import { type CharacterDto } from '@entities/character';
import { CharacterPortraitWithFrame } from '@widgets/character-portrait/CharacterPortraitWithFrame';
import { getCharacterXpTowardNext } from '@entities/character/lib/level-curve';
import { SpaLink } from '@shared/lib/navigation';
import { AppLogo } from '@shared/ui/app-logo/AppLogo';
import { navigate } from '@shared/lib/navigation-core';
import {
  acceptFriendRequest,
  fetchUserRelation,
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
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    navigate('/workspaces');
  }

  function openMessages() {
    navigate(`/profile/character?with=${userId}`);
  }

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

        <section className="trello-character-profile trello-character-profile--other-user trello-character-profile--other-user-dashboard">
          <div className="trello-character-other-user-dashboard">
            <div className="trello-character-other-user-dashboard-col trello-character-other-user-dashboard-col--portrait">
              <div className="trello-character-profile-portrait-wrap trello-character-profile-portrait-wrap--square">
                <CharacterPortraitWithFrame
                  avatarPreset={character.avatarPreset}
                  frameKey={character.equippedPortraitFrameKey}
                  profileBackgroundKey={character.equippedProfileBackgroundKey}
                />
              </div>
              <p className="trello-character-other-user-name">{character.name}</p>
              <div className="trello-character-streak-block">
                <CheckinStreakCounter streak={character.checkinStreak ?? 0} size="profile" />
              </div>
            </div>
            <div className="trello-character-other-user-dashboard-col trello-character-other-user-dashboard-col--stats">
              <CharacterStatsPanel
                character={character}
                xpToward={xpToward}
                variant="dashboard"
              />
            </div>
            {relation ? (
              <div className="trello-character-other-user-dashboard-col trello-character-other-user-dashboard-col--social">
                <UserCharacterProfileFoot
                  accessToken={accessToken}
                  userId={userId}
                  friendCode={character.friendCode}
                  relation={relation}
                  socialBusy={socialBusy}
                  onAddFriend={() => void handleAddFriend()}
                  onMessage={openMessages}
                  onRelationChange={setRelation}
                  onError={setSocialMsg}
                  layout="sidebar"
                />
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
