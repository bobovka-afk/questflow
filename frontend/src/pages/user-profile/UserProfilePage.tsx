import { useEffect, useMemo, useState } from 'react';
import { api, formatApiError, isRateLimitMessage } from '@shared/api';
import {
  acceptFriendRequest,
  fetchUserRelation,
  sendFriendRequest,
  type UserRelationView,
} from '@entities/social';
import { avatarInitials, avatarSrcFromPath, userCharacterPath, type UserProfileView } from '@entities/user';
import { SpaLink } from '@shared/lib/navigation';
import { navigate } from '@shared/lib/navigation-core';
import { ProfileToolbarAnchor } from '@shared/ui/profile-toolbar';

function formatRegisteredRU(isoDate: string) {
  const d = new Date(isoDate);
  const day = d.getDate();
  const monthGenitive = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];
  const month = monthGenitive[d.getMonth()] ?? '';
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

type Props = {
  accessToken: string;
  userId: number;
  currentUserId: number | null;
};

export function UserProfilePage({ accessToken, userId, currentUserId }: Props) {
  const [user, setUser] = useState<UserProfileView | null>(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [avatarBroken, setAvatarBroken] = useState(false);
  const [relation, setRelation] = useState<UserRelationView | null>(null);
  const [socialBusy, setSocialBusy] = useState(false);
  const [socialMsg, setSocialMsg] = useState<string | null>(null);

  const isSelf = currentUserId != null && userId === currentUserId;

  useEffect(() => {
    if (isSelf) {
      navigate('/profile/me');
    }
  }, [isSelf]);

  useEffect(() => {
    if (isSelf) return;
    let cancelled = false;
    void (async () => {
      setLoading(true);
      setMsg(null);
      try {
        const res = await api<UserProfileView>(`/user/profile/${userId}`, {
          method: 'GET',
          accessToken,
        });
        if (!cancelled) {
          setUser(res);
          setAvatarBroken(false);
        }
      } catch (e) {
        if (!cancelled) setMsg(formatApiError(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [accessToken, userId, isSelf]);

  useEffect(() => {
    if (isSelf || loading || !user) return;
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
  }, [accessToken, userId, isSelf, loading, user]);

  const avatarSrc = useMemo(() => avatarSrcFromPath(user?.avatarPath), [user?.avatarPath]);

  const isErrorMsg =
    msg != null && (msg.toLowerCase().includes('ошиб') || msg.toLowerCase().includes('error'));
  const isRateLimitMsg = msg != null && isRateLimitMessage(msg);

  function goBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.history.pushState({}, '', '/workspaces');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  function openMessages() {
    navigate(`/profile/character?with=${userId}`);
  }

  async function handleAddFriend() {
    if (user?.friendCode == null) return;
    setSocialBusy(true);
    setSocialMsg(null);
    try {
      if (relation?.incomingRequestId != null) {
        await acceptFriendRequest(accessToken, relation.incomingRequestId);
      } else {
        await sendFriendRequest(accessToken, user.friendCode);
      }
      const rel = await fetchUserRelation(accessToken, userId);
      setRelation(rel);
    } catch (e) {
      setSocialMsg(formatApiError(e));
    } finally {
      setSocialBusy(false);
    }
  }

  const canMessage = relation?.canMessage ?? false;

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
          <h1 className="trello-topbar-stripe-center">Профиль участника</h1>
          <div className="trello-topbar-actions">
            <button type="button" className="trello-btn trello-btn-ghost" onClick={goBack}>
              Назад
            </button>
            <ProfileToolbarAnchor />
          </div>
        </header>

        {msg ? (
          <div
            className={
              isRateLimitMsg
                ? 'trello-banner trello-banner-rate-limit'
                : isErrorMsg
                  ? 'trello-banner trello-banner-error'
                  : 'trello-banner trello-banner-warn'
            }
          >
            {msg}
          </div>
        ) : null}

        {socialMsg ? (
          <div className="trello-banner trello-banner-warn">{socialMsg}</div>
        ) : null}

        <section className="trello-panel">
          {loading ? (
            <div className="trello-empty">Загрузка…</div>
          ) : user ? (
            <div className="trello-profile-body">
              <div className="trello-profile-body-row">
                <div className="trello-profile-avatar-col">
                  <div className="avatarWrap">
                    {avatarSrc && !avatarBroken ? (
                      <img
                        className="avatarImg"
                        src={avatarSrc}
                        alt=""
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={() => setAvatarBroken(true)}
                      />
                    ) : (
                      <div className="trello-profile-avatar-initials" aria-hidden>
                        {avatarInitials(user.name)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="trello-profile-fields-col">
                  <div className="trello-profile-name-block">
                    <h2 className="trello-profile-display-name trello-user-profile-name">{user.name}</h2>
                  </div>
                  <div className="trello-label">Участник с</div>
                  <div style={{ marginBottom: 16 }}>
                    {user.createdAt ? formatRegisteredRU(user.createdAt) : '—'}
                  </div>

                  <div className="trello-user-profile-social">
                    {user.allowCharacterView ? (
                      <SpaLink className="trello-btn trello-btn-primary" to={userCharacterPath(userId)}>
                        Персонаж
                      </SpaLink>
                    ) : (
                      <span className="trello-cell-meta">Персонаж скрыт в настройках приватности</span>
                    )}
                    {canMessage ? (
                      <button
                        type="button"
                        className="trello-btn trello-btn-ghost"
                        onClick={openMessages}
                      >
                        Сообщение
                      </button>
                    ) : null}
                    {!relation?.isFriend && !relation?.outgoingRequestId && user.friendCode != null ? (
                      <button
                        type="button"
                        className="trello-btn trello-btn-primary trello-btn-sm"
                        disabled={socialBusy}
                        onClick={() => void handleAddFriend()}
                      >
                        {socialBusy
                          ? '…'
                          : relation?.incomingRequestId != null
                            ? 'Принять заявку'
                            : 'В друзья'}
                      </button>
                    ) : null}
                    {relation?.outgoingRequestId != null && !relation.isFriend ? (
                      <span className="trello-cell-meta">Заявка отправлена</span>
                    ) : null}
                    {relation?.isFriend ? (
                      <span className="trello-cell-meta">В друзьях</span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="trello-empty">Профиль не найден.</div>
          )}
        </section>
      </div>
    </div>
  );
}
