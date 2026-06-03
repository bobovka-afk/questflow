import { useEffect, useState } from 'react';
import {
  fetchPendingEmailChange,
  fetchUserSessions,
  requestEmailChange,
  revokeOtherUserSessions,
  revokeUserSession,
  useGamificationSettings,
  useNotificationSettings,
  usePrivacySettings,
  type PendingEmailChangeDto,
  type UserSessionDto,
} from '@entities/user-settings';
import { api, formatApiError } from '@shared/api';
import { navigate, SpaLink } from '@shared/lib';
import { ProfileToolbarAnchor } from '@shared/ui/profile-toolbar';
import { SettingsSwitch } from '@shared/ui/settings-switch/SettingsSwitch';
import { SettingsPasswordPanel } from '@widgets/settings-password/SettingsPasswordPanel';
import { SettingsDeleteAccountPanel } from '@widgets/settings-delete-account/SettingsDeleteAccountPanel';
import {
  SETTINGS_TAB_LABELS,
  SETTINGS_TABS,
  settingsRouteForTab,
  type SettingsTab,
} from './settingsRoutes';

type UserSafe = {
  id: number;
  email: string;
  name: string;
  hasPassword: boolean;
};

type Props = {
  accessToken: string | null;
  initialTab?: SettingsTab;
  onAccountDeleted?: () => void;
};

function formatDateTimeRu(iso: string): string {
  return new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SettingsPage(props: Props) {
  const [user, setUser] = useState<UserSafe | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [tab, setTab] = useState<SettingsTab>(props.initialTab ?? 'security');
  const [gamificationSettings, setGamificationSettings, gamificationMeta] =
    useGamificationSettings(props.accessToken);
  const [privacySettings, setPrivacySettings, privacyMeta] = usePrivacySettings(
    props.accessToken,
  );
  const [notificationSettings, setNotificationSettings, notificationMeta] =
    useNotificationSettings(props.accessToken);
  const [sessions, setSessions] = useState<UserSessionDto[]>([]);
  const [pendingEmail, setPendingEmail] = useState<PendingEmailChangeDto>(null);
  const [newEmail, setNewEmail] = useState('');
  const [emailChangePassword, setEmailChangePassword] = useState('');
  const [emailChangeBusy, setEmailChangeBusy] = useState(false);
  const [emailChangeMsg, setEmailChangeMsg] = useState<string | null>(null);
  const [securityLoading, setSecurityLoading] = useState(false);
  const [sessionBusyId, setSessionBusyId] = useState<string | null>(null);
  const [revokeOthersBusy, setRevokeOthersBusy] = useState(false);

  useEffect(() => {
    async function load() {
      setMsg(null);
      if (!props.accessToken) {
        setMsg('Пожалуйста, сначала выполните вход.');
        return;
      }
      try {
        const res = await api<UserSafe>('/user/me', {
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
    if (!props.accessToken || tab !== 'security') return;
    let cancelled = false;
    setSecurityLoading(true);
    void (async () => {
      try {
        const nextSessions = await fetchUserSessions(props.accessToken!);
        if (!cancelled) {
          setSessions(nextSessions);
        }
      } catch (e) {
        if (!cancelled) setMsg(formatApiError(e));
      } finally {
        if (!cancelled) setSecurityLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [props.accessToken, tab]);

  useEffect(() => {
    if (!props.accessToken || tab !== 'account') return;
    let cancelled = false;
    void (async () => {
      try {
        const pending = await fetchPendingEmailChange(props.accessToken!);
        if (!cancelled) setPendingEmail(pending);
      } catch {
        if (!cancelled) setPendingEmail(null);
      }
    })();
    const params = new URLSearchParams(window.location.search);
    const status = params.get('emailChange');
    if (status === 'success') {
      setEmailChangeMsg('Email обновлён. Подтверждения с обоих адресов получены.');
      void loadUser();
    } else if (status === 'pending') {
      setEmailChangeMsg('Подтверждение получено. Дождитесь второго письма.');
    } else if (status === 'invalid') {
      setEmailChangeMsg('Ссылка недействительна или устарела.');
    }
    return () => {
      cancelled = true;
    };
  }, [props.accessToken, tab]);

  async function loadUser() {
    if (!props.accessToken) return;
    try {
      const res = await api<UserSafe>('/user/me', {
        method: 'GET',
        accessToken: props.accessToken,
      });
      setUser(res);
    } catch (e) {
      setMsg(formatApiError(e));
    }
  }

  async function handleRequestEmailChange() {
    if (!props.accessToken) return;
    setEmailChangeBusy(true);
    setEmailChangeMsg(null);
    try {
      await requestEmailChange(props.accessToken, {
        newEmail,
        currentPassword: emailChangePassword || undefined,
      });
      setEmailChangeMsg('Письма отправлены на старый и новый адрес. Подтвердите оба.');
      const pending = await fetchPendingEmailChange(props.accessToken);
      setPendingEmail(pending);
      setNewEmail('');
      setEmailChangePassword('');
    } catch (e) {
      setEmailChangeMsg(formatApiError(e));
    } finally {
      setEmailChangeBusy(false);
    }
  }

  async function handleRevokeSession(sessionId: string) {
    if (!props.accessToken) return;
    setSessionBusyId(sessionId);
    setMsg(null);
    try {
      await revokeUserSession(props.accessToken, sessionId);
      setSessions((rows) => rows.filter((row) => row.id !== sessionId));
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setSessionBusyId(null);
    }
  }

  async function handleRevokeOtherSessions() {
    if (!props.accessToken) return;
    setRevokeOthersBusy(true);
    setMsg(null);
    try {
      await revokeOtherUserSessions(props.accessToken);
      const nextSessions = await fetchUserSessions(props.accessToken);
      setSessions(nextSessions);
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setRevokeOthersBusy(false);
    }
  }

  function renderTabContent() {
    switch (tab) {
      case 'account':
        return (
          <div className="trello-settings-section">
            <p className="trello-settings-section-lead">
              Просмотр данных аккаунта. Имя и аватар редактируются в профиле.
            </p>
            {emailChangeMsg ? (
              <div className="trello-banner trello-banner-warn">{emailChangeMsg}</div>
            ) : null}
            <article className="trello-settings-card">
              <h2 className="trello-settings-card-title">Текущая почта</h2>
              <p className="trello-settings-card-value">{user?.email ?? '—'}</p>
            </article>
            {pendingEmail ? (
              <article className="trello-settings-card trello-settings-card--muted">
                <h2 className="trello-settings-card-title">Смена в процессе</h2>
                <p className="trello-settings-card-hint">
                  Новый адрес: <strong>{pendingEmail.newEmail}</strong>
                </p>
                <p className="trello-settings-card-hint">
                  Старый: {pendingEmail.oldConfirmed ? 'подтверждён' : 'ожидает'} · Новый:{' '}
                  {pendingEmail.newConfirmed ? 'подтверждён' : 'ожидает'}
                </p>
              </article>
            ) : null}
            <article className="trello-settings-card">
              <h2 className="trello-settings-card-title">Сменить email</h2>
              <label className="trello-field">
                <span className="trello-label">Новый email</span>
                <input
                  className="trello-input"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  disabled={emailChangeBusy}
                />
              </label>
              {user?.hasPassword ? (
                <label className="trello-field">
                  <span className="trello-label">Текущий пароль</span>
                  <input
                    className="trello-input"
                    type="password"
                    value={emailChangePassword}
                    onChange={(e) => setEmailChangePassword(e.target.value)}
                    disabled={emailChangeBusy}
                  />
                </label>
              ) : null}
              <button
                type="button"
                className="trello-btn trello-btn-primary trello-btn-sm"
                disabled={emailChangeBusy || !newEmail.trim()}
                onClick={() => void handleRequestEmailChange()}
              >
                {emailChangeBusy ? '…' : 'Отправить подтверждения'}
              </button>
            </article>
            <article className="trello-settings-card">
              <h2 className="trello-settings-card-title">Профиль</h2>
              <p className="trello-settings-card-hint">
                Отображаемое имя и фото аккаунта настраиваются на странице профиля.
              </p>
              <SpaLink className="trello-btn trello-btn-primary trello-btn-sm" to="/profile/me">
                Открыть профиль
              </SpaLink>
            </article>
            {props.accessToken && props.onAccountDeleted ? (
              <SettingsDeleteAccountPanel
                accessToken={props.accessToken}
                hasPassword={Boolean(user?.hasPassword)}
                onDeleted={props.onAccountDeleted}
              />
            ) : null}
          </div>
        );

      case 'security':
        return (
          <div className="trello-settings-section">
            <p className="trello-settings-section-lead">
              Пароль и активные сессии на ваших устройствах.
            </p>

            {props.accessToken ? (
              <SettingsPasswordPanel
                accessToken={props.accessToken}
                user={user}
                onUserUpdated={() => void loadUser()}
              />
            ) : null}

            <article className="trello-settings-card">
              {(() => {
                const otherActiveCount = sessions.filter((s) => !s.isCurrent).length;
                return (
                  <>
                    <div className="trello-settings-card-head-row">
                      <h2 className="trello-settings-card-title">Устройства и сессии</h2>
                      <button
                        type="button"
                        className="trello-btn trello-btn-ghost trello-btn-sm"
                        disabled={
                          revokeOthersBusy ||
                          securityLoading ||
                          otherActiveCount === 0
                        }
                        onClick={() => void handleRevokeOtherSessions()}
                      >
                        {revokeOthersBusy ? '…' : 'Завершить все другие'}
                      </button>
                    </div>
                    {securityLoading ? (
                      <p className="trello-settings-card-hint">Загрузка…</p>
                    ) : sessions.length === 0 ? (
                      <p className="trello-settings-card-hint">Активных сессий пока нет.</p>
                    ) : (
                      <ul className="trello-settings-session-list">
                        {sessions.map((session) => (
                          <li key={session.id} className="trello-settings-session-item">
                            <div className="trello-settings-session-main">
                              <strong>
                                {session.deviceLabel ?? 'Неизвестное устройство'}
                                {session.isCurrent ? ' · текущая' : ''}
                              </strong>
                              <span className="trello-settings-session-meta">
                                Последняя активность: {formatDateTimeRu(session.lastSeenAt)}
                                {session.ipAddress ? ` · ${session.ipAddress}` : ''}
                              </span>
                            </div>
                            <button
                              type="button"
                              className="trello-btn trello-btn-ghost trello-btn-sm"
                              disabled={session.isCurrent || sessionBusyId === session.id}
                              onClick={() => void handleRevokeSession(session.id)}
                            >
                              {sessionBusyId === session.id ? '…' : 'Завершить'}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                );
              })()}
            </article>
          </div>
        );

      case 'notifications':
        return (
          <div className="trello-settings-section">
            <p className="trello-settings-section-lead">
              Email-уведомления и связь с in-app оповещениями о наградах.
            </p>
            {notificationMeta.loading ? (
              <p className="trello-settings-card-hint">Загрузка…</p>
            ) : (
              <div className="trello-settings-switches">
                <SettingsSwitch
                  label="Письма о безопасности"
                  description="Смена пароля, вход с нового устройства, смена email."
                  checked={notificationSettings.emailSecurity}
                  disabled={notificationMeta.saving}
                  onChange={(checked) =>
                    setNotificationSettings({ emailSecurity: checked })
                  }
                />
                <SettingsSwitch
                  label="Приглашения в workspace"
                  description="Письма с приглашением в команду."
                  checked={notificationSettings.emailWorkspaceInvites}
                  disabled={notificationMeta.saving}
                  onChange={(checked) =>
                    setNotificationSettings({ emailWorkspaceInvites: checked })
                  }
                />
                <p className="trello-settings-card-hint">
                  Всплывающие XP и анимация чекина — во вкладке «Геймификация».
                </p>
              </div>
            )}
          </div>
        );

      case 'gamification':
        return (
          <div className="trello-settings-section">
            <p className="trello-settings-section-lead">
              Поведение на доске при закрытии карточки и начислении опыта.
            </p>
            {gamificationMeta.loading ? (
              <p className="trello-settings-card-hint">Загрузка…</p>
            ) : (
              <div className="trello-settings-switches">
                <SettingsSwitch
                  label="Анимация чекина при закрытии карточки"
                  description="Счётчик серии 🔥 с прокруткой в уведомлении о чекине за день."
                  checked={gamificationSettings.checkinAnimationOnCardClose}
                  disabled={gamificationMeta.saving}
                  onChange={(checked) =>
                    setGamificationSettings({ checkinAnimationOnCardClose: checked })
                  }
                />
                <SettingsSwitch
                  label="Уведомления о получении опыта"
                  description="Всплывающие сообщения с XP и HP после закрытия карточки."
                  checked={gamificationSettings.xpGainNotifications}
                  disabled={gamificationMeta.saving}
                  onChange={(checked) =>
                    setGamificationSettings({ xpGainNotifications: checked })
                  }
                />
              </div>
            )}
          </div>
        );

      case 'privacy':
        return (
          <div className="trello-settings-section">
            <p className="trello-settings-section-lead">
              Кто видит ваш публичный профиль и персонажа среди участников общих воркспейсов.
              Email другим пользователям не показывается.
            </p>
            {privacyMeta.loading ? (
              <p className="trello-settings-card-hint">Загрузка…</p>
            ) : (
              <div className="trello-settings-switches">
                <SettingsSwitch
                  label="Показывать персонажа другим"
                  description="Если выключено, коллеги не откроют страницу персонажа и не увидят кнопку «Персонаж»."
                  checked={privacySettings.allowCharacterView}
                  disabled={privacyMeta.saving}
                  onChange={(checked) => setPrivacySettings({ allowCharacterView: checked })}
                />
                <SettingsSwitch
                  label="Показывать аватар аккаунта в профиле"
                  description="Фото аккаунта на странице участника; при выключении — инициалы."
                  checked={privacySettings.showAccountAvatarOnPublicProfile}
                  disabled={privacyMeta.saving}
                  onChange={(checked) =>
                    setPrivacySettings({ showAccountAvatarOnPublicProfile: checked })
                  }
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
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
          <h1 className="trello-topbar-stripe-center">Настройки</h1>
          <div className="trello-topbar-actions">
            <SpaLink className="trello-btn trello-btn-ghost" to="/profile/me">
              Профиль
            </SpaLink>
            <SpaLink className="trello-btn trello-btn-ghost" to="/workspaces">
              Назад
            </SpaLink>
            <ProfileToolbarAnchor />
          </div>
        </header>

        {msg ? <div className="trello-banner trello-banner-warn">{msg}</div> : null}

        <section className="trello-panel trello-settings-panel">
          <nav className="trello-settings-tabs" aria-label="Разделы настроек">
            {SETTINGS_TABS.map((key) => (
              <button
                key={key}
                type="button"
                className={[
                  'trello-settings-tab',
                  tab === key ? 'trello-settings-tab--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() => {
                  setTab(key);
                  navigate(settingsRouteForTab(key));
                }}
              >
                {SETTINGS_TAB_LABELS[key]}
              </button>
            ))}
          </nav>

          {renderTabContent()}
        </section>
      </div>
    </div>
  );
}
