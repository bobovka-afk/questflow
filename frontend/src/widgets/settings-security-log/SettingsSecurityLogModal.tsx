import { useEffect, useState } from 'react';
import { fetchSecurityEvents, securityEventLabelRu, type UserSecurityEventDto } from '@entities/user-settings';
import { formatDateTimeRu } from '@shared/lib/formatDateRu';

type Props = {
  accessToken: string | null;
  open: boolean;
  onClose: () => void;
};

export function SettingsSecurityLogModal({ accessToken, open, onClose }: Props) {
  const [rows, setRows] = useState<UserSecurityEventDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open || !accessToken) {
      setRows([]);
      setLoading(!open);
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
  }, [accessToken, open]);

  if (!open) return null;

  return (
    <div
      className="trello-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="trello-modal trello-modal--security-log"
        role="dialog"
        aria-modal
        aria-labelledby="security-log-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trello-modal-head">
          <h2 className="trello-modal-title" id="security-log-title">
            Журнал безопасности
          </h2>
          <button type="button" className="trello-modal-close" onClick={onClose} aria-label="Закрыть">
            ×
          </button>
        </div>
        <div className="trello-modal-body">
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
                      {formatDateTimeRu(row.createdAt)}
                      {row.ipAddress ? ` · ${row.ipAddress}` : ''}
                      {row.deviceLabel ? ` · ${row.deviceLabel}` : ''}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="trello-modal-foot">
          <button type="button" className="trello-btn trello-btn-ghost" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
