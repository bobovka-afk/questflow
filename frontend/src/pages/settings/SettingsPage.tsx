import { useEffect, useState } from 'react';
import {
  fetchPendingEmailChange,
  fetchUserSessions,
  fetchUserSettings,
  patchDisplayTimezone,
  requestEmailChange,
  revokeOtherUserSessions,
  revokeUserSession,
  useGamificationSettings,
  useNotificationSettings,
  usePrivacySettings,
  type PendingEmailChangeDto,
  type UserSessionDto,
} from '@entities/user-settings';
import { isValidUsername, normalizeUsername, profilePathForUsername, updateUsername } from '@entities/user';
import { api, formatApiError } from '@shared/api';
import { formatDateTimeRuSettings } from '@shared/lib/formatDateRu';
import { SpaLink } from '@shared/lib';
import { AppLogo } from '@shared/ui/app-logo/AppLogo';
import { SettingsSwitch } from '@shared/ui/settings-switch/SettingsSwitch';
import { SettingsPasswordPanel } from '@widgets/settings-password/SettingsPasswordPanel';
import { SettingsDeleteAccountPanel } from '@widgets/settings-delete-account/SettingsDeleteAccountPanel';
import { SettingsSecurityLogModal } from '@widgets/settings-security-log/SettingsSecurityLogModal';
import { SettingsWebPushPanel } from '@widgets/settings-web-push/SettingsWebPushPanel';
import {
  SETTINGS_TAB_LABELS,
  SETTINGS_TABS,
  replaceSettingsTabInUrl,
  type SettingsTab,
} from './settingsRoutes';

type UserSafe = {
  id: number;
  email: string;
  name: string;
  username: string | null;
  hasPassword: boolean;
};

const DISPLAY_TIMEZONE_SUGGESTIONS = [
  'Europe/Moscow',
  'Europe/Kyiv',
  'Asia/Almaty',
  'UTC',
  'Europe/Berlin',
  'America/New_York',
];

type Props = {
  accessToken: string | null;
  initialTab?: SettingsTab;
  onAccountDeleted?: () => void;
};

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
  const [securityLogOpen, setSecurityLogOpen] = useState(false);
  const [usernameDraft, setUsernameDraft] = useState('');
  const [usernameBusy, setUsernameBusy] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState<string | null>(null);
  const [displayTimezone, setDisplayTimezone] = useState('');
  const [timezoneBusy, setTimezoneBusy] = useState(false);
  const [timezoneMsg, setTimezoneMsg] = useState<string | null>(null);
  useEffect(() => {
    setTab(props.initialTab ?? 'security');
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }, [props.initialTab]);

  function selectTab(key: SettingsTab) {
    if (tab === key) return;
    setTab(key);
    replaceSettingsTabInUrl(key);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'auto' });
    });
  }

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
        setUsernameDraft(res.username ?? '');
      } catch (e) {
        setMsg(formatApiError(e));
      }
    }
    void load();
  }, [props.accessToken]);

  useEffect(() => {
    if (!props.accessToken) return;
    let cancelled = false;
    setSecurityLoading(true);
    void (async () => {
      try {
        const [settings, nextSessions, pending] = await Promise.all([
          fetchUserSettings(props.accessToken!),
          fetchUserSessions(props.accessToken!),
          fetchPendingEmailChange(props.accessToken!),
        ]);
        if (cancelled) return;
        const tz =
          typeof settings.displayTimezone === 'string' ? settings.displayTimezone : '';
        setDisplayTimezone(tz);
        setSessions(nextSessions);
        setPendingEmail(pending);
      } catch (e) {
        if (!cancelled) setMsg(formatApiError(e));
      } finally {
        if (!cancelled) setSecurityLoading(false);
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
  }, [props.accessToken]);

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

  async function handleSaveUsername() {
    if (!props.accessToken) return;
    const normalized = normalizeUsername(usernameDraft);
    if (!isValidUsername(normalized)) {
      setUsernameMsg('3–32 символа: латиница, цифры, подчёркивание.');
      return;
    }
    setUsernameBusy(true);
    setUsernameMsg(null);
    try {
      const updated = await updateUsername(props.accessToken, normalized);
      setUser((u) => (u ? { ...u, username: updated.username } : u));
      setUsernameDraft(updated.username ?? normalized);
      setUsernameMsg('Username сохранён.');
    } catch (e) {
      setUsernameMsg(formatApiError(e));
    } finally {
      setUsernameBusy(false);
    }
  }

  async function handleSaveTimezone() {
    if (!props.accessToken) return;
    const tz = displayTimezone.trim();
    if (!tz) {
      setTimezoneMsg('Укажите часовой пояс, например Europe/Moscow.');
      return;
    }
    setTimezoneBusy(true);
    setTimezoneMsg(null);
    try {
      const res = await patchDisplayTimezone(props.accessToken, tz);
      setDisplayTimezone(res.displayTimezone ?? tz);
      setTimezoneMsg('Часовой пояс сохранён.');
    } catch (e) {
      setTimezoneMsg(formatApiError(e));
    } finally {
      setTimezoneBusy(false);
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

  function renderTabContent(activeTab: SettingsTab) {
    switch (activeTab) {
      case 'account':
        return (
          <div className="trello-settings-section">
            <header className="trello-settings-section-head">
              <h2 className="trello-settings-section-lead">
                Просмотр данных аккаунта. Имя и аватар редактируются в профиле.
              </h2>
            </header>
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
              <div className="trello-settings-card-actions">
                <button
                  type="button"
                  className="trello-btn trello-btn-primary trello-btn-sm"
                  disabled={emailChangeBusy || !newEmail.trim()}
                  onClick={() => void handleRequestEmailChange()}
                >
                  {emailChangeBusy ? '…' : 'Отправить подтверждения'}
                </button>
              </div>
            </article>
            <article className="trello-settings-card">
              <h2 className="trello-settings-card-title">Публичный @username</h2>
              <p className="trello-settings-card-hint">
                Ссылка для других:{' '}
                {user?.username ? (
                  <SpaLink to={profilePathForUsername(user.username)}>
                    {profilePathForUsername(user.username)}
                  </SpaLink>
                ) : (
                  'задайте ник ниже'
                )}
              </p>
              {usernameMsg ? (
                <p className="trello-settings-card-hint">{usernameMsg}</p>
              ) : null}
              <label className="trello-field">
                <span className="trello-label">Username</span>
                <input
                  className="trello-input"
                  type="text"
                  value={usernameDraft}
                  onChange={(e) => setUsernameDraft(e.target.value)}
                  placeholder="hero_42"
                  autoComplete="off"
                  disabled={usernameBusy}
                  maxLength={32}
                />
              </label>
              <div className="trello-settings-card-actions">
                <button
                  type="button"
                  className="trello-btn trello-btn-primary trello-btn-sm"
                  disabled={usernameBusy || !usernameDraft.trim()}
                  onClick={() => void handleSaveUsername()}
                >
                  {usernameBusy ? '…' : 'Сохранить username'}
                </button>
              </div>
            </article>
            <article className="trello-settings-card">
              <h2 className="trello-settings-card-title">Часовой пояс отображения</h2>
              <p className="trello-settings-card-hint">
                Для дедлайнов и подписей времени в интерфейсе. Сброс игровых суток на сервере
                не меняется.
              </p>
              {timezoneMsg ? (
                <p className="trello-settings-card-hint">{timezoneMsg}</p>
              ) : null}
              <div className="trello-field trello-settings-timezone-field">
                <select
                  className="trello-input trello-settings-timezone-select"
                  value={displayTimezone}
                  onChange={(e) => setDisplayTimezone(e.target.value)}
                  disabled={timezoneBusy}
                >
                  {!displayTimezone ? (
                    <option value="" disabled>
                      Выберите часовой пояс
                    </option>
                  ) : null}
                  {(displayTimezone &&
                  !DISPLAY_TIMEZONE_SUGGESTIONS.includes(displayTimezone)
                    ? [displayTimezone, ...DISPLAY_TIMEZONE_SUGGESTIONS]
                    : DISPLAY_TIMEZONE_SUGGESTIONS
                  ).map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>
              <div className="trello-settings-card-actions">
                <button
                  type="button"
                  className="trello-btn trello-btn-primary trello-btn-sm"
                  disabled={timezoneBusy || !displayTimezone.trim()}
                  onClick={() => void handleSaveTimezone()}
                >
                  {timezoneBusy ? '…' : 'Сохранить часовой пояс'}
                </button>
              </div>
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
            <header className="trello-settings-section-head">
              <h2 className="trello-settings-section-lead">
                Пароль и активные сессии на ваших устройствах.
              </h2>
            </header>

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
                      <div className="trello-settings-card-head-actions">
                        <button
                          type="button"
                          className="trello-btn trello-btn-ghost trello-btn-sm"
                          onClick={() => setSecurityLogOpen(true)}
                        >
                          Журнал безопасности
                        </button>
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
                    </div>
                    {securityLoading && sessions.length === 0 ? (
                      <p className="trello-settings-card-hint trello-settings-session-placeholder">
                        Загрузка…
                      </p>
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
                                Последняя активность:{' '}
                                {formatDateTimeRuSettings(session.lastSeenAt)}
                              </span>
                            </div>
                            <button
                              type="button"
                              className={`trello-btn trello-btn-sm ${
                                session.isCurrent
                                  ? 'trello-settings-session-btn--current trello-btn-primary'
                                  : 'trello-btn-ghost'
                              }`}
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

            <SettingsSecurityLogModal
              accessToken={props.accessToken}
              open={securityLogOpen}
              onClose={() => setSecurityLogOpen(false)}
            />
          </div>
        );

      case 'notifications':
        return (
          <div className="trello-settings-section">
            <header className="trello-settings-section-head">
              <h2 className="trello-settings-section-lead">
                Письма на почту и оповещения в колоколе на сайте.
              </h2>
            </header>
            <div
              className="trello-settings-switches"
              aria-busy={notificationMeta.loading || undefined}
            >
              <SettingsSwitch
                label="Письма о безопасности"
                description="Смена пароля, вход с нового устройства, смена email."
                checked={notificationSettings.emailSecurity}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) => setNotificationSettings({ emailSecurity: checked })}
              />
              <SettingsSwitch
                label="Приглашения в команду"
                description="Письма с приглашением в рабочее пространство."
                checked={notificationSettings.emailWorkspaceInvites}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) =>
                  setNotificationSettings({ emailWorkspaceInvites: checked })
                }
              />
              <SettingsSwitch
                label="Квесты, сундуки и достижения"
                description="Колокол в шапке."
                checked={notificationSettings.inAppGamification}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) =>
                  setNotificationSettings({ inAppGamification: checked })
                }
              />
              <SettingsSwitch
                label="Упоминания (@)"
                description="Колокол в шапке."
                checked={notificationSettings.inAppMentions}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) => setNotificationSettings({ inAppMentions: checked })}
              />
              <SettingsSwitch
                label="Дедлайны карточек"
                description="Колокол в шапке."
                checked={notificationSettings.inAppDeadlines}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) => setNotificationSettings({ inAppDeadlines: checked })}
              />
              <SettingsSwitch
                label="Назначение на карточку"
                description="Колокол в шапке."
                checked={notificationSettings.inAppAssign}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) => setNotificationSettings({ inAppAssign: checked })}
              />
              <SettingsSwitch
                label="Друзья и рейды"
                description="Колокол в шапке."
                checked={notificationSettings.inAppSocial}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) => setNotificationSettings({ inAppSocial: checked })}
              />
              <p className="trello-settings-card-hint">
                Всплывающие XP на доске — вкладка «Геймификация» (не дублируют колокол).
              </p>
              <p className="trello-settings-card-hint">
                Всплывающие уведомления браузера (нужна подписка ниже):
              </p>
              <SettingsSwitch
                label="Назначение на карточку"
                description="Всплывающее уведомление браузера."
                checked={notificationSettings.pushAssign}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) => setNotificationSettings({ pushAssign: checked })}
              />
              <SettingsSwitch
                label="Упоминания (@)"
                description="Всплывающее уведомление браузера."
                checked={notificationSettings.pushMention}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) => setNotificationSettings({ pushMention: checked })}
              />
              <SettingsSwitch
                label="Заявки в друзья"
                description="Всплывающее уведомление браузера."
                checked={notificationSettings.pushFriendRequest}
                disabled={notificationMeta.saving || notificationMeta.loading}
                onChange={(checked) =>
                  setNotificationSettings({ pushFriendRequest: checked })
                }
              />
            </div>
            {props.accessToken ? (
              <SettingsWebPushPanel accessToken={props.accessToken} />
            ) : null}
          </div>
        );

      case 'gamification':
        return (
          <div className="trello-settings-section">
            <header className="trello-settings-section-head">
              <h2 className="trello-settings-section-lead">
                Поведение на доске при закрытии карточки и начислении опыта.
              </h2>
            </header>
            <div
              className="trello-settings-switches"
              aria-busy={gamificationMeta.loading || undefined}
            >
              <SettingsSwitch
                label="Анимация чекина при закрытии карточки"
                description="Счётчик серии 🔥 с прокруткой в уведомлении о чекине за день."
                checked={gamificationSettings.checkinAnimationOnCardClose}
                disabled={gamificationMeta.saving || gamificationMeta.loading}
                onChange={(checked) =>
                  setGamificationSettings({ checkinAnimationOnCardClose: checked })
                }
              />
              <SettingsSwitch
                label="Уведомления о получении опыта"
                description="Всплывающие сообщения с XP и HP после закрытия карточки."
                checked={gamificationSettings.xpGainNotifications}
                disabled={gamificationMeta.saving || gamificationMeta.loading}
                onChange={(checked) =>
                  setGamificationSettings({ xpGainNotifications: checked })
                }
              />
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="trello-settings-section">
            <header className="trello-settings-section-head">
              <h2 className="trello-settings-section-lead">
                Кто видит ваш публичный профиль и персонажа среди участников общих
                воркспейсов. Email другим пользователям не показывается.
              </h2>
            </header>
            <div className="trello-settings-switches" aria-busy={privacyMeta.loading || undefined}>
              <SettingsSwitch
                label="Показывать персонажа другим"
                description="Если выключено, коллеги не откроют страницу персонажа и не увидят кнопку «Персонаж»."
                checked={privacySettings.allowCharacterView}
                disabled={privacyMeta.saving || privacyMeta.loading}
                onChange={(checked) => setPrivacySettings({ allowCharacterView: checked })}
              />
              <SettingsSwitch
                label="Показывать аватар аккаунта в профиле"
                description="Фото аккаунта на странице участника; при выключении — инициалы."
                checked={privacySettings.showAccountAvatarOnPublicProfile}
                disabled={privacyMeta.saving || privacyMeta.loading}
                onChange={(checked) =>
                  setPrivacySettings({ showAccountAvatarOnPublicProfile: checked })
                }
              />
              <SettingsSwitch
                label="Статус «в сети» для друзей"
                description="Друзья видят онлайн и время последней активности в списке."
                checked={privacySettings.showOnlineStatusToFriends}
                disabled={privacyMeta.saving || privacyMeta.loading}
                onChange={(checked) =>
                  setPrivacySettings({ showOnlineStatusToFriends: checked })
                }
              />
            </div>
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
              <AppLogo />
              <span className="trello-top-left-brand-text">Questflow</span>
            </SpaLink>
            <SpaLink className="trello-btn trello-btn-topbar-nav trello-topbar-back-btn" to="/workspaces">
              Назад
            </SpaLink>
          </div>
          <h1 className="trello-topbar-stripe-center">Настройки</h1>
          <div className="trello-topbar-actions">
            <SpaLink className="trello-btn trello-btn-ghost" to="/settings">
              Настройки
            </SpaLink>
          </div>
        </header>

        {msg ? <div className="trello-banner trello-banner-warn">{msg}</div> : null}

        <section className="trello-panel trello-settings-panel trello-settings-panel--split">
          <div className="trello-settings-split">
            <nav className="trello-settings-split-nav" aria-label="Разделы настроек" role="tablist">
              {SETTINGS_TABS.map((key) => {
                const isActive = tab === key;
                return (
                  <button
                    key={key}
                    id={`settings-tab-${key}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`settings-tabpanel-${key}`}
                    className={[
                      'trello-settings-tab',
                      isActive ? 'trello-settings-tab--active' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => selectTab(key)}
                  >
                    {SETTINGS_TAB_LABELS[key]}
                  </button>
                );
              })}
            </nav>
            <div className="trello-settings-split-body">
              {SETTINGS_TABS.map((key) => {
                const isActive = tab === key;
                return (
                  <div
                    key={key}
                    id={`settings-tabpanel-${key}`}
                    className={[
                      'trello-settings-tab-panel',
                      isActive ? '' : 'trello-settings-tab-panel--inactive',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    role="tabpanel"
                    aria-labelledby={`settings-tab-${key}`}
                    aria-hidden={!isActive}
                    tabIndex={isActive ? 0 : -1}
                  >
                    {renderTabContent(key)}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
