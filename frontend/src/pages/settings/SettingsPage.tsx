import { useEffect, useState } from 'react';
import {
  fetchSecurityEvents,
  fetchUserSessions,
  revokeOtherUserSessions,
  revokeUserSession,
  securityEventLabelRu,
  useGamificationSettings,
  type UserSecurityEventDto,
  type UserSessionDto,
} from '@entities/user-settings';
import { api, formatApiError } from '@shared/api';
import { navigate, SpaLink } from '@shared/lib';
import { ProfileToolbarAnchor } from '@shared/ui/profile-toolbar';
import { SettingsSwitch } from '@shared/ui/settings-switch/SettingsSwitch';
import { settingsRouteForTab, type SettingsTab } from './settingsRoutes';

type UserSafe = {
  id: number;
  email: string;
  name: string;
  hasPassword: boolean;
};

type Props = {
  accessToken: string | null;
  initialTab?: SettingsTab;
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
  const [sessions, setSessions] = useState<UserSessionDto[]>([]);
  const [securityEvents, setSecurityEvents] = useState<UserSecurityEventDto[]>([]);
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
        const [nextSessions, nextEvents] = await Promise.all([
          fetchUserSessions(props.accessToken!),
          fetchSecurityEvents(props.accessToken!),
        ]);
        if (!cancelled) {
          setSessions(nextSessions);
          setSecurityEvents(nextEvents);
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

  async function handleRevokeSession(sessionId: string) {
    if (!props.accessToken) return;
    setSessionBusyId(sessionId);
    setMsg(null);
    try {
      await revokeUserSession(props.accessToken, sessionId);
      setSessions((rows) =>
        rows.map((row) =>
          row.id === sessionId ? { ...row, isRevoked: true, isCurrent: false } : row,
        ),
      );
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

        {msg ? (
          <div className="trello-banner trello-banner-warn">{msg}</div>
        ) : null}

        <section className="trello-panel trello-settings-panel">
          <nav className="trello-settings-tabs" aria-label="Разделы настроек">
            <button
              type="button"
              className={[
                'trello-settings-tab',
                tab === 'security' ? 'trello-settings-tab--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                setTab('security');
                navigate(settingsRouteForTab('security'));
              }}
            >
              Безопасность
            </button>
            <button
              type="button"
              className={[
                'trello-settings-tab',
                tab === 'gamification' ? 'trello-settings-tab--active' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                setTab('gamification');
                navigate(settingsRouteForTab('gamification'));
              }}
            >
              Геймификация
            </button>
          </nav>

          {tab === 'security' ? (
            <div className="trello-settings-section">
              <p className="trello-settings-section-lead">
                Действия с подтверждением: смена почты, пароля и другие чувствительные изменения.
              </p>

              <article className="trello-settings-card">
                <h2 className="trello-settings-card-title">Почта</h2>
                <p className="trello-settings-card-value">{user?.email ?? '—'}</p>
                <p className="trello-settings-card-hint">
                  Смена адреса потребует подтверждения на старой и новой почте. Функция в разработке.
                </p>
              </article>

              <article className="trello-settings-card">
                <h2 className="trello-settings-card-title">Пароль</h2>
                <p className="trello-settings-card-hint">
                  {user?.hasPassword
                    ? 'Для смены пароля нужен текущий пароль и подтверждение нового.'
                    : 'У аккаунта пока нет пароля — можно задать его для входа по почте.'}
                </p>
                <SpaLink
                  className="trello-btn trello-btn-primary trello-btn-sm"
                  to="/profile/me#password"
                >
                  {user?.hasPassword ? 'Сменить пароль' : 'Установить пароль'}
                </SpaLink>
              </article>

              <article className="trello-settings-card">
                <div className="trello-settings-card-head-row">
                  <h2 className="trello-settings-card-title">Устройства и сессии</h2>
                  <button
                    type="button"
                    className="trello-btn trello-btn-ghost trello-btn-sm"
                    disabled={revokeOthersBusy || securityLoading}
                    onClick={() => void handleRevokeOtherSessions()}
                  >
                    {revokeOthersBusy ? '…' : 'Завершить другие'}
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
                          {session.isRevoked ? (
                            <span className="trello-settings-session-revoked">Завершена</span>
                          ) : null}
                        </div>
                        {!session.isRevoked && !session.isCurrent ? (
                          <button
                            type="button"
                            className="trello-btn trello-btn-ghost trello-btn-sm"
                            disabled={sessionBusyId === session.id}
                            onClick={() => void handleRevokeSession(session.id)}
                          >
                            {sessionBusyId === session.id ? '…' : 'Завершить'}
                          </button>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                )}
              </article>

              <article className="trello-settings-card">
                <h2 className="trello-settings-card-title">История изменений</h2>
                {securityLoading ? (
                  <p className="trello-settings-card-hint">Загрузка…</p>
                ) : securityEvents.length === 0 ? (
                  <p className="trello-settings-card-hint">Записей пока нет.</p>
                ) : (
                  <ul className="trello-settings-event-list">
                    {securityEvents.map((event) => (
                      <li key={event.id} className="trello-settings-event-item">
                        <strong>{securityEventLabelRu(event.type)}</strong>
                        <span className="trello-settings-session-meta">
                          {formatDateTimeRu(event.createdAt)}
                          {event.ipAddress ? ` · ${event.ipAddress}` : ''}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </div>
          ) : (
            <div className="trello-settings-section">
              <p className="trello-settings-section-lead">
                Поведение на доске при закрытии карточки и начислении опыта. Настройки сохраняются в
                аккаунте и синхронизируются между устройствами.
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
          )}
        </section>
      </div>
    </div>
  );
}
