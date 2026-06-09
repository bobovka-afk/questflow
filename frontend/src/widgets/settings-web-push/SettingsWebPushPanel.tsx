import { useEffect, useState } from 'react';
import { formatApiError } from '@shared/api';
import {
  fetchVapidPublicKey,
  getWebPushSupportStatus,
  subscribeWebPush,
  unsubscribeWebPush,
} from '@entities/notification/lib/webPushSubscribe';

type Props = {
  accessToken: string;
};

export function SettingsWebPushPanel({ accessToken }: Props) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [vapidReady, setVapidReady] = useState<boolean | null>(null);
  const supportStatus = getWebPushSupportStatus();
  const supported = supportStatus === 'supported';

  useEffect(() => {
    if (!supported || !accessToken) {
      setVapidReady(null);
      return;
    }
    let cancelled = false;
    fetchVapidPublicKey(accessToken)
      .then((key) => {
        if (!cancelled) setVapidReady(Boolean(key));
      })
      .catch(() => {
        if (!cancelled) setVapidReady(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, supported]);

  async function handleEnable() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await subscribeWebPush(accessToken);
      if (!res.ok) {
        if (res.reason === 'insecure_context') {
          setMsg('Уведомления браузера работают только по HTTPS (или на localhost).');
        } else if (res.reason === 'unsupported') {
          setMsg('Браузер не поддерживает уведомления.');
        } else if (res.reason === 'no_vapid') {
          setMsg('Уведомления не настроены на сервере (нет VAPID-ключей).');
        } else if (res.reason === 'denied') {
          setMsg('Разрешите уведомления в браузере.');
        } else {
          setMsg(res.message ?? 'Не удалось включить уведомления.');
        }
        return;
      }
      setMsg('Уведомления включены для этого браузера.');
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    setBusy(true);
    setMsg(null);
    try {
      await unsubscribeWebPush(accessToken);
      setMsg('Уведомления отключены на этом устройстве.');
    } catch (e) {
      setMsg(formatApiError(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="trello-settings-card">
      <h2 className="trello-settings-card-title">Уведомления в браузере</h2>
      <p className="trello-settings-card-hint">
        Отдельно от писем на почту и колокола на сайте. Переключатели выше работают после
        подписки на этом устройстве.
      </p>
      {supportStatus === 'insecure_context' ? (
        <p className="trello-settings-card-hint">
          Браузерные уведомления доступны только по HTTPS или на localhost. Сейчас сайт открыт по{' '}
          {window.location.protocol}//{window.location.host} — на HTTP браузер их блокирует.
        </p>
      ) : null}
      {supportStatus === 'unsupported' ? (
        <p className="trello-settings-card-hint">Ваш браузер не поддерживает такие уведомления.</p>
      ) : null}
      {supported ? (
        <>
          {vapidReady === false ? (
            <p className="trello-settings-card-hint">
              Уведомления не настроены на сервере (нет VAPID-ключей). Добавьте их в backend/.env и
              перезапустите API.
            </p>
          ) : null}
          <div
            className="trello-settings-card-actions"
            style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}
          >
            <button
              type="button"
              className="trello-btn trello-btn-primary trello-btn-sm"
              disabled={busy || vapidReady !== true}
              onClick={() => void handleEnable()}
            >
              {busy ? '…' : 'Включить на этом устройстве'}
            </button>
            <button
              type="button"
              className="trello-btn trello-btn-ghost trello-btn-sm"
              disabled={busy}
              onClick={() => void handleDisable()}
            >
              Отключить
            </button>
          </div>
        </>
      ) : null}
      {msg ? <p className="trello-settings-card-hint" style={{ marginTop: 8 }}>{msg}</p> : null}
    </article>
  );
}
