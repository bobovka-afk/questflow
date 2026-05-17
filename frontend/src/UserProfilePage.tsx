import { useEffect, useMemo, useState } from 'react';
import { api, formatApiError, isRateLimitMessage } from './lib/api';
import { avatarInitials, avatarSrcFromPath, userCharacterPath } from './lib/avatar';
import { navigate, SpaLink } from './lib/navigation';
import { ProfileToolbarAnchor } from './profileToolbarOutlet';

type UserProfileView = {
  id: number;
  name: string;
  avatarPath: string | null;
  email: string;
  createdAt: string;
};

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
            {isSelf ? (
              <SpaLink className="trello-btn trello-btn-ghost" to="/profile/me">
                Мой профиль
              </SpaLink>
            ) : null}
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

        <section className="trello-panel">
          {loading ? (
            <div className="trello-empty">Загрузка…</div>
          ) : user ? (
            <div className="trello-profile-body">
              <div className="trello-profile-body-row">
                <div className="trello-profile-avatar-col">
                  <div className="avatarWrap trello-user-profile-avatar-wrap">
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
                      <div className="trello-profile-avatar-fallback trello-user-profile-avatar-fallback">
                        {avatarInitials(user.name)}
                      </div>
                    )}
                  </div>
                </div>
                <div className="trello-profile-fields-col">
                  <div className="trello-profile-name-block">
                    <h2 className="trello-profile-display-name trello-user-profile-name">{user.name}</h2>
                  </div>
                  <div className="trello-label">Почта</div>
                  <div style={{ marginBottom: 12 }}>{user.email}</div>
                  <div className="trello-label">Зарегистрирован</div>
                  <div style={{ marginBottom: 16 }}>
                    {user.createdAt ? formatRegisteredRU(user.createdAt) : '—'}
                  </div>
                  <SpaLink className="trello-btn trello-btn-primary" to={userCharacterPath(userId)}>
                    Персонаж
                  </SpaLink>
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
