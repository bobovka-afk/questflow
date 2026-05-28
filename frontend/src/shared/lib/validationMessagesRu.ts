const FIELD_LABEL_RU: Record<string, string> = {
  email: 'Email',
  password: 'Пароль',
  name: 'Имя',
  token: 'Токен',
  newpassword: 'Новый пароль',
  currentpassword: 'Текущий пароль',
};

function fieldLabel(field: string): string {
  return FIELD_LABEL_RU[field.toLowerCase()] ?? field;
}

function translateKnownValidationLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  const lower = trimmed.toLowerCase();

  if (lower === 'email must be an email' || lower === 'email must be a valid email') {
    return 'Укажите корректный email.';
  }
  if (lower === 'email should not be empty' || lower === 'email must not be empty') {
    return 'Укажите email.';
  }
  if (lower === 'password should not be empty' || lower === 'password must not be empty') {
    return 'Укажите пароль.';
  }
  if (lower === 'name should not be empty' || lower === 'name must not be empty') {
    return 'Укажите имя.';
  }
  if (lower === 'password must be longer than or equal to 6 characters') {
    return 'Пароль: минимум 6 символов.';
  }
  if (lower === 'password must be shorter than or equal to 72 characters') {
    return 'Пароль: не более 72 символов.';
  }
  if (lower === 'name must be longer than or equal to 3 characters') {
    return 'Имя: минимум 3 символа.';
  }
  if (lower === 'name must be shorter than or equal to 18 characters') {
    return 'Имя: не более 18 символов.';
  }
  if (lower === 'name must be a string') {
    return 'Имя должно быть текстом.';
  }
  if (lower === 'password must be a string') {
    return 'Пароль должен быть текстом.';
  }
  if (lower === 'newpassword should not be empty' || lower === 'newpassword must not be empty') {
    return 'Введите новый пароль.';
  }
  if (lower === 'new password should not be empty') {
    return 'Введите новый пароль.';
  }
  if (
    lower === 'newpassword must be longer than or equal to 6 characters' ||
    lower === 'new password must be longer than or equal to 6 characters'
  ) {
    return 'Новый пароль: минимум 6 символов.';
  }
  if (
    lower === 'newpassword must be shorter than or equal to 72 characters' ||
    lower === 'new password must be shorter than or equal to 72 characters'
  ) {
    return 'Новый пароль: не более 72 символов.';
  }
  if (lower === 'token should not be empty') {
    return 'Укажите токен подтверждения.';
  }

  const emailMatch = /^email must be an email$/i.exec(trimmed);
  if (emailMatch) return 'Укажите корректный email.';

  const propertyForbidden = /^property (.+) should not exist$/i.exec(trimmed);
  if (propertyForbidden) {
    return `Лишнее поле: ${propertyForbidden[1]}`;
  }

  const mustBeEmail = /^(\w+) must be an email$/i.exec(trimmed);
  if (mustBeEmail) {
    return `Укажите корректный ${fieldLabel(mustBeEmail[1]).toLowerCase() === 'email' ? 'email' : fieldLabel(mustBeEmail[1])}.`;
  }

  const shouldNotBeEmpty = /^(\w+) should not be empty$/i.exec(trimmed);
  if (shouldNotBeEmpty) {
    const f = shouldNotBeEmpty[1];
    if (f === 'email') return 'Укажите email.';
    if (f === 'password') return 'Укажите пароль.';
    if (f === 'name') return 'Укажите имя.';
    return `Заполните поле «${fieldLabel(f)}».`;
  }

  const minLength = /^(\w+) must be longer than or equal to (\d+) characters?$/i.exec(trimmed);
  if (minLength) {
    const f = minLength[1];
    const n = minLength[2];
    if (f === 'password') return `Пароль: минимум ${n} символов.`;
    if (f === 'name') return `Имя: минимум ${n} символов.`;
    if (f === 'newPassword') return `Новый пароль: минимум ${n} символов.`;
    return `${fieldLabel(f)}: минимум ${n} символов.`;
  }

  const maxLength = /^(\w+) must be shorter than or equal to (\d+) characters?$/i.exec(trimmed);
  if (maxLength) {
    const f = maxLength[1];
    const n = maxLength[2];
    if (f === 'password') return `Пароль: не более ${n} символов.`;
    if (f === 'name') return `Имя: не более ${n} символов.`;
    if (f === 'newPassword') return `Новый пароль: не более ${n} символов.`;
    return `${fieldLabel(f)}: не более ${n} символов.`;
  }

  const mustBeString = /^(\w+) must be a string$/i.exec(trimmed);
  if (mustBeString) {
    return `${fieldLabel(mustBeString[1])} должно быть текстом.`;
  }

  return null;
}

export function translateValidationMessages(message: string): string {
  const parts = message.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return message;

  const translated = parts.map((part) => translateKnownValidationLine(part) ?? part);
  const changed = translated.some((t, i) => t !== parts[i]);
  if (!changed && parts.length === 1) {
    const single = translateKnownValidationLine(message);
    return single ?? message;
  }
  return translated.join(' ');
}
