import { useEffect, useMemo, useRef, useState } from 'react';
import { api, API_URL, formatApiError, isRateLimitMessage } from '@shared/api';
import { profilePathForUsername } from '@entities/user';
import { navigate, SpaLink } from '@shared/lib';

export type ProfileMeUser = {
  id: number;
  email: string;
  name: string;
  username?: string | null;
  avatarPath?: string | null;
  hasPassword: boolean;
  createdAt: string;
};

type Props = {
  accessToken: string | null;
  onUserUpdated?: (user: ProfileMeUser) => void;
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

export function ProfileMePage(props: Props) {
  const [user, setUser] = useState<ProfileMeUser | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState(false);
  const [avatarEditMenuOpen, setAvatarEditMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [nameEditing, setNameEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState('');
  const [nameBusy, setNameBusy] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (window.location.hash === '#password') {
      navigate('/settings/security#password');
    }
  }, []);

  useEffect(() => {
    async function load() {
      setMsg(null);
      if (!props.accessToken) {
        setMsg('Пожалуйста, сначала выполните вход.');
        return;
      }

      try {
        const res = await api<ProfileMeUser>('/user/me', {
          method: 'GET',
          accessToken: props.accessToken,
        });
        setUser(res);
      } catch (e) {
        setMsg(formatApiError(e));
      }
    }

    void load();
  }, [props.accessToken]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setAvatarError(false);
  }, [user?.avatarPath, previewUrl]);

  const avatarSrc = useMemo(() => {
    if (!user) return '';
    const p = previewUrl || user.avatarPath || '';
    if (!p) return '';
    if (p.startsWith('data:')) return p;
    if (p.startsWith('http://') || p.startsWith('https://')) return p;
    if (p.startsWith('//')) return `https:${p}`;
    if (p.startsWith('/')) return `${API_URL}${p}`;
    return `${API_URL}/${p}`;
  }, [previewUrl, user]);

  async function uploadAvatar(fileToUpload: File) {
    if (!props.accessToken) return;

    setBusy(true);
    setMsg(null);
    try {
      const form = new FormData();
      form.append('file', fileToUpload);

      const updated = await api<ProfileMeUser>('/user/update-avatar', {
        method: 'PATCH',
        accessToken: props.accessToken,
        body: form,
      });
      setUser(updated);
      props.onUserUpdated?.(updated);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  function onPickFile(file: File | null) {
    setMsg(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (!file) return;

    const MAX_BYTES = 50 * 1024;
    if (file.size > MAX_BYTES) {
      setMsg('Файл слишком большой. Максимум ~50 KB.');
      return;
    }

    const nextPreview = URL.createObjectURL(file);
    setPreviewUrl(nextPreview);
    void uploadAvatar(file);
  }

  function triggerPick() {
    setMsg(null);
    fileInputRef.current?.click();
  }

  async function removeAvatar() {
    if (!props.accessToken) return;

    setBusy(true);
    setMsg(null);
    try {
      const updated = await api<ProfileMeUser>('/user/remove-avatar', {
        method: 'DELETE',
        accessToken: props.accessToken,
      });
      setUser(updated);
      props.onUserUpdated?.(updated);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      setMsg('Аватар удалён.');
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  function beginEditName() {
    if (!user || nameBusy || busy) return;
    setNameDraft(user.name);
    setNameEditing(true);
    setMsg(null);
    queueMicrotask(() => nameInputRef.current?.focus());
  }

  function cancelEditName() {
    setNameEditing(false);
    setNameDraft('');
  }

  async function saveName() {
    if (!props.accessToken || !user) return;
    const next = nameDraft.trim();
    if (next.length < 3 || next.length > 18) {
      setMsg('Имя: от 3 до 18 символов.');
      return;
    }
    if (next === user.name) {
      setNameEditing(false);
      return;
    }
    setNameBusy(true);
    setMsg(null);
    try {
      const updated = await api<ProfileMeUser>('/user/me', {
        method: 'PATCH',
        accessToken: props.accessToken,
        json: { name: next },
      });
      setUser(updated);
      props.onUserUpdated?.(updated);
      setNameEditing(false);
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setNameBusy(false);
    }
  }

  const isErrorMsg =
    typeof msg === 'string' &&
    (msg.toLowerCase().includes('ошиб') || msg.toLowerCase().includes('error'));
  const isRateLimitMsg = isRateLimitMessage(msg);

  return (
    <div className="trello-app-shell">
      <div className="trello-boards-main">
        <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
          <div className="trello-topbar-stripe-left">
            <SpaLink className="trello-top-left-brand trello-top-left-brand--stripe" to="/workspaces">
              <span className="trello-logo" aria-hidden />
              <span className="trello-top-left-brand-text">Questflow</span>
            </SpaLink>
            <SpaLink className="trello-btn trello-btn-topbar-nav trello-topbar-back-btn" to="/workspaces">
              Назад
            </SpaLink>
          </div>
          <h1 className="trello-topbar-stripe-center">Профиль</h1>
          <div className="trello-topbar-actions">
            <SpaLink className="trello-btn trello-btn-ghost" to="/settings">
              Настройки
            </SpaLink>
          </div>
        </header>

        {msg && (
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
        )}

        <section className="trello-panel">
          <p className="trello-profile-body-lead">Данные аккаунта и быстрый переход к разделам.</p>
          <div className="trello-profile-body">
            <div className="trello-profile-body-row">
              <div className="trello-profile-avatar-col">
                <div className="avatarWrap">
                  {previewUrl || user?.avatarPath ? (
                    !avatarError ? (
                      <img
                        className="avatarImg"
                        src={avatarSrc}
                        alt=""
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        crossOrigin="anonymous"
                        onError={() => setAvatarError(true)}
                      />
                    ) : (
                      <div className="trello-cell-meta trello-profile-avatar-fallback">
                        Не удалось загрузить аватар
                      </div>
                    )
                  ) : (
                    <div className="trello-cell-meta trello-profile-avatar-fallback">Нет аватара</div>
                  )}

                  <button
                    type="button"
                    className="avatar-edit-toggle"
                    onClick={() => setAvatarEditMenuOpen((o) => !o)}
                    disabled={busy}
                    aria-label="Изменить аватар"
                  >
                    <span className="avatar-edit-toggle-icon" aria-hidden>
                      ✎
                    </span>
                    <span className="avatar-edit-toggle-text">Изменить</span>
                  </button>

                  {avatarEditMenuOpen && (
                    <div className="avatar-edit-menu" role="menu" aria-label="Действия с аватаром">
                      <button
                        type="button"
                        className="trello-btn trello-btn-primary trello-btn-sm avatar-edit-menu-btn"
                        disabled={busy}
                        onClick={() => {
                          setAvatarEditMenuOpen(false);
                          triggerPick();
                        }}
                      >
                        {busy ? '…' : 'Загрузить фото'}
                      </button>
                      <button
                        type="button"
                        className="trello-btn trello-btn-danger-ghost trello-btn-sm avatar-edit-menu-btn"
                        disabled={busy || !user?.avatarPath}
                        onClick={() => {
                          setAvatarEditMenuOpen(false);
                          void removeAvatar();
                        }}
                      >
                        {busy ? '…' : 'Удалить фото'}
                      </button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => onPickFile(e.target.files?.[0] ?? null)}
                  disabled={busy}
                />
              </div>

              <div className="trello-profile-fields-col">
                <div className="trello-profile-name-block">
                  {nameEditing ? (
                    <div className="trello-profile-name-edit">
                      <input
                        ref={nameInputRef}
                        className="trello-input trello-profile-name-input"
                        value={nameDraft}
                        onChange={(e) => setNameDraft(e.target.value)}
                        maxLength={18}
                        disabled={nameBusy}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            void saveName();
                          }
                          if (e.key === 'Escape') {
                            e.preventDefault();
                            cancelEditName();
                          }
                        }}
                        aria-label="Имя"
                      />
                      <div className="trello-profile-name-edit-actions">
                        <button
                          type="button"
                          className="trello-btn trello-btn-primary trello-btn-sm"
                          disabled={nameBusy}
                          onClick={() => void saveName()}
                        >
                          {nameBusy ? '…' : 'Сохранить'}
                        </button>
                        <button
                          type="button"
                          className="trello-btn trello-btn-ghost trello-btn-sm"
                          disabled={nameBusy}
                          onClick={() => cancelEditName()}
                        >
                          Отмена
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="trello-profile-display-name"
                      onClick={() => beginEditName()}
                      disabled={!user || busy || nameBusy}
                      title="Нажмите, чтобы изменить имя"
                    >
                      {user?.name ?? '—'}
                    </button>
                  )}
                </div>

                <div className="trello-label">Публичная ссылка</div>
                <div style={{ marginBottom: 12 }}>
                  {user?.username ? (
                    <SpaLink to={profilePathForUsername(user.username)}>
                      @{user.username}
                    </SpaLink>
                  ) : (
                    <span className="trello-muted">
                      Не задан —{' '}
                      <SpaLink to="/settings/account">настройки аккаунта</SpaLink>
                    </span>
                  )}
                </div>

                <div className="trello-label">Почта</div>
                <div style={{ marginBottom: 12 }}>{user?.email ?? '—'}</div>

                <div className="trello-label">Зарегистрирован</div>
                <div style={{ marginBottom: 0 }}>
                  {user?.createdAt ? formatRegisteredRU(user.createdAt) : '—'}
                </div>
              </div>
            </div>

            <nav className="trello-profile-hub" aria-label="Разделы профиля">
              <SpaLink className="trello-profile-hub-card" to="/profile/character">
                <h2 className="trello-profile-hub-card-title">Персонаж</h2>
                <p className="trello-profile-hub-card-desc">XP, квесты, друзья и рейды</p>
              </SpaLink>
              <SpaLink className="trello-profile-hub-card" to="/invites">
                <h2 className="trello-profile-hub-card-title">Приглашения</h2>
                <p className="trello-profile-hub-card-desc">Воркспейсы и входящие приглашения</p>
              </SpaLink>
              <SpaLink className="trello-profile-hub-card" to="/settings">
                <h2 className="trello-profile-hub-card-title">Настройки</h2>
                <p className="trello-profile-hub-card-desc">Безопасность, уведомления, конфиденциальность</p>
              </SpaLink>
              <SpaLink className="trello-profile-hub-card" to="/workspaces">
                <h2 className="trello-profile-hub-card-title">Рабочие пространства</h2>
                <p className="trello-profile-hub-card-desc">Доски и командная работа</p>
              </SpaLink>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
