import { describe, expect, it } from 'vitest';
import { securityEventLabelRu } from './securityEventLabels';

describe('securityEventLabelRu', () => {
  it('returns Russian labels for known event types', () => {
    expect(securityEventLabelRu('PASSWORD_CHANGED')).toBe('Пароль изменён');
    expect(securityEventLabelRu('SESSION_CREATED')).toBe('Новый вход в аккаунт');
    expect(securityEventLabelRu('GAMIFICATION_SETTINGS_CHANGED')).toBe(
      'Изменены настройки геймификации',
    );
  });

  it('falls back to raw type for unknown events', () => {
    expect(securityEventLabelRu('CUSTOM_EVENT')).toBe('CUSTOM_EVENT');
  });
});
