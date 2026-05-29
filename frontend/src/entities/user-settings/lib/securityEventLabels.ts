const LABELS: Record<string, string> = {
  PASSWORD_CHANGED: 'Пароль изменён',
  PASSWORD_SET: 'Пароль установлен',
  PASSWORD_RESET: 'Пароль сброшен по ссылке',
  SESSION_CREATED: 'Новый вход в аккаунт',
  SESSION_REVOKED: 'Сессия завершена',
  SESSIONS_REVOKED_ALL_OTHER: 'Завершены другие сессии',
  GAMIFICATION_SETTINGS_CHANGED: 'Изменены настройки геймификации',
  SITE_SETTINGS_CHANGED: 'Изменены настройки сайта',
  SECURITY_SETTINGS_CHANGED: 'Изменены настройки безопасности',
  EMAIL_CHANGE_REQUESTED: 'Запрошена смена почты',
  EMAIL_CHANGED: 'Почта изменена',
};

export function securityEventLabelRu(type: string): string {
  return LABELS[type] ?? type;
}
