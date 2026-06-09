import { useEffect, useState } from 'react';
import { fetchSecurityEvents, securityEventLabelRu, type UserSecurityEventDto } from '@entities/user-settings';
import { formatSecurityEventMeta } from '@shared/lib/formatSecurityEventMeta';

type Props = {
  accessToken: string | null;
};

export function SettingsSecurityLog({ accessToken }: Props) {
  const [rows, setRows] = useState<UserSecurityEventDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      setRows([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    void fetchSecurityEvents(accessToken)
      .then((list) => {
        if (!cancelled) setRows(Array.isArray(list) ? list : []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return (
    <article className="trello-settings-card">
      <h2 className="trello-settings-card-title">Журнал безопасности</h2>
      <p className="trello-settings-card-hint">
        Смена пароля, входы, сессии, почта и удаление аккаунта — с IP и устройством.
      </p>
      {loading ? (
        <p className="trello-settings-card-hint">Загрузка…</p>
      ) : rows.length === 0 ? (
        <p className="trello-settings-card-hint">Событий пока нет.</p>
      ) : (
        <ul className="trello-settings-security-log">
          {rows.map((row) => (
            <li key={row.id} className="trello-settings-security-log-item">
              <div className="trello-settings-security-log-main">
                <strong>{securityEventLabelRu(row.type)}</strong>
                <span className="trello-settings-security-log-meta">
                  {formatSecurityEventMeta(row)}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
