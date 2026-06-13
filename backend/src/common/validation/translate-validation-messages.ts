const FIELD_LABEL_RU: Record<string, string> = {
  email: 'Email',
  password: 'Пароль',
  name: 'Имя',
  token: 'Токен',
  newpassword: 'Новый пароль',
  currentpassword: 'Текущий пароль',
  title: 'Название',
  description: 'Описание',
  username: 'Имя пользователя',
  body: 'Текст',
  url: 'Ссылка',
  displayname: 'Отображаемое имя',
  confirmphrase: 'Фраза подтверждения',
  role: 'Роль',
  tier: 'Тип',
  slot: 'Слот',
  cosmeticid: 'Косметика',
  chesttier: 'Тип сундука',
  friendcode: 'Код друга',
  targetuserid: 'Пользователь',
  displaytimezone: 'Часовой пояс',
};

/** Legacy English auth messages (до перевода AuthValidationMsg). */
const EXACT_EN_TO_RU: Record<string, string> = {
  'enter a valid email address.': 'Укажите корректный email.',
  'email is required.': 'Укажите email.',
  'password is required.': 'Укажите пароль.',
  'password must be a string.': 'Пароль должен быть текстом.',
  'password must be at least 6 characters.': 'Пароль: минимум 6 символов.',
  'password must be at most 72 characters.': 'Пароль: не более 72 символов.',
  'name is required.': 'Укажите имя.',
  'name must be a string.': 'Имя должно быть текстом.',
  'name must be at least 3 characters.': 'Имя: минимум 3 символа.',
  'name must be at most 18 characters.': 'Имя: не более 18 символов.',
  'confirmation token is required.': 'Укажите токен подтверждения.',
  'token must be a string.': 'Токен должен быть текстом.',
  'new password is required.': 'Введите новый пароль.',
  'new password must be a string.': 'Новый пароль должен быть текстом.',
  'new password must be at least 6 characters.': 'Новый пароль: минимум 6 символов.',
  'new password must be at most 72 characters.': 'Новый пароль: не более 72 символов.',
  'current password must be a string.': 'Текущий пароль должен быть текстом.',
  'current password must be at least 6 characters.': 'Текущий пароль: минимум 6 символов.',
  'current password must be at most 72 characters.': 'Текущий пароль: не более 72 символов.',
  'validation failed': 'Проверьте введённые данные.',
};

function fieldLabel(field: string): string {
  return FIELD_LABEL_RU[field.toLowerCase()] ?? field;
}

function isAlreadyRussian(text: string): boolean {
  return /[а-яА-ЯёЁ]/.test(text);
}

function translateKnownValidationLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (isAlreadyRussian(trimmed)) return trimmed;

  const lower = trimmed.toLowerCase();

  const exact = EXACT_EN_TO_RU[lower];
  if (exact) return exact;

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
  if (lower === 'token should not be empty' || lower === 'token must not be empty') {
    return 'Укажите токен подтверждения.';
  }
  if (lower === 'newpassword should not be empty' || lower === 'newpassword must not be empty') {
    return 'Введите новый пароль.';
  }
  if (lower === 'new password should not be empty' || lower === 'new password must not be empty') {
    return 'Введите новый пароль.';
  }

  const unexpectedField = /^unexpected field: (.+)$/i.exec(trimmed);
  if (unexpectedField) {
    return `Лишнее поле: ${unexpectedField[1]}`;
  }

  const propertyForbidden = /^property (.+) should not exist$/i.exec(trimmed);
  if (propertyForbidden) {
    return `Лишнее поле: ${propertyForbidden[1]}`;
  }

  const mustBeEmail = /^(\w+) must be an email$/i.exec(trimmed);
  if (mustBeEmail) {
    const f = mustBeEmail[1].toLowerCase();
    return f === 'email' ? 'Укажите корректный email.' : `Укажите корректный ${fieldLabel(f)}.`;
  }

  const shouldNotBeEmpty = /^(\w+) should not be empty$/i.exec(trimmed);
  if (shouldNotBeEmpty) {
    const f = shouldNotBeEmpty[1].toLowerCase();
    if (f === 'email') return 'Укажите email.';
    if (f === 'password') return 'Укажите пароль.';
    if (f === 'name') return 'Укажите имя.';
    return `Заполните поле «${fieldLabel(f)}».`;
  }

  const mustNotBeEmpty = /^(\w+) must not be empty$/i.exec(trimmed);
  if (mustNotBeEmpty) {
    const f = mustNotBeEmpty[1].toLowerCase();
    if (f === 'email') return 'Укажите email.';
    if (f === 'password') return 'Укажите пароль.';
    if (f === 'name') return 'Укажите имя.';
    return `Заполните поле «${fieldLabel(f)}».`;
  }

  const minLength =
    /^(\w+) must be longer than or equal to (\d+) characters?$/i.exec(trimmed) ??
    /^(\w+) must be at least (\d+) characters?\.?$/i.exec(trimmed);
  if (minLength) {
    const f = minLength[1];
    const n = minLength[2];
    if (f.toLowerCase() === 'password') return `Пароль: минимум ${n} символов.`;
    if (f.toLowerCase() === 'name') return `Имя: минимум ${n} символов.`;
    if (f.toLowerCase() === 'newpassword') return `Новый пароль: минимум ${n} символов.`;
    return `${fieldLabel(f)}: минимум ${n} символов.`;
  }

  const maxLength =
    /^(\w+) must be shorter than or equal to (\d+) characters?$/i.exec(trimmed) ??
    /^(\w+) must be at most (\d+) characters?\.?$/i.exec(trimmed);
  if (maxLength) {
    const f = maxLength[1];
    const n = maxLength[2];
    if (f.toLowerCase() === 'password') return `Пароль: не более ${n} символов.`;
    if (f.toLowerCase() === 'name') return `Имя: не более ${n} символов.`;
    if (f.toLowerCase() === 'newpassword') return `Новый пароль: не более ${n} символов.`;
    return `${fieldLabel(f)}: не более ${n} символов.`;
  }

  const mustBeString = /^(\w+) must be a string$/i.exec(trimmed);
  if (mustBeString) {
    return `${fieldLabel(mustBeString[1])} должно быть текстом.`;
  }

  const mustBeInt = /^(\w+) must be an integer number$/i.exec(trimmed);
  if (mustBeInt) {
    return `${fieldLabel(mustBeInt[1])}: укажите целое число.`;
  }

  const mustBeBoolean = /^(\w+) must be a boolean value$/i.exec(trimmed);
  if (mustBeBoolean) {
    return `${fieldLabel(mustBeBoolean[1])}: укажите да или нет.`;
  }

  const mustBeUrl = /^(\w+) must be a URL address$/i.exec(trimmed);
  if (mustBeUrl) {
    return `${fieldLabel(mustBeUrl[1])}: укажите корректную ссылку.`;
  }

  const mustBeDate = /^(\w+) must be a valid ISO 8601 date string$/i.exec(trimmed);
  if (mustBeDate) {
    return `${fieldLabel(mustBeDate[1])}: укажите корректную дату.`;
  }

  const mustBeEnum = /^(\w+) must be one of the following values: (.+)$/i.exec(trimmed);
  if (mustBeEnum) {
    return `${fieldLabel(mustBeEnum[1])}: недопустимое значение.`;
  }

  const mustBeIn = /^(\w+) must be one of the following values: (.+)$/i.exec(trimmed);
  if (mustBeIn) {
    return `${fieldLabel(mustBeIn[1])}: недопустимое значение.`;
  }

  const mustBeArray = /^(\w+) must be an array$/i.exec(trimmed);
  if (mustBeArray) {
    return `${fieldLabel(mustBeArray[1])}: ожидается список.`;
  }

  const minNumber = /^(\w+) must not be less than (\d+)$/i.exec(trimmed);
  if (minNumber) {
    return `${fieldLabel(minNumber[1])}: значение не меньше ${minNumber[2]}.`;
  }

  const maxNumber = /^(\w+) must not be greater than (\d+)$/i.exec(trimmed);
  if (maxNumber) {
    return `${fieldLabel(maxNumber[1])}: значение не больше ${maxNumber[2]}.`;
  }

  return null;
}

function splitValidationParts(message: string): string[] {
  if (message.includes(',')) {
    return message
      .split(',')
      .map((p) => p.trim())
      .filter(Boolean);
  }
  const sentences = message.match(/[^.]+\./g);
  if (sentences && sentences.length > 1) {
    return sentences.map((s) => s.trim()).filter(Boolean);
  }
  return message ? [message] : [];
}

/** Убирает артефакты склейки «текст., текст.» через запятую. */
export function normalizeValidationMessagePunctuation(message: string): string {
  return message
    .replace(/\.,\s*/g, '. ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

export function formatValidationMessageList(messages: string[]): string {
  return messages
    .map((m) => normalizeValidationMessagePunctuation(m.trim()))
    .filter(Boolean)
    .join('\n');
}

export function translateValidationMessages(message: string): string {
  const normalized = normalizeValidationMessagePunctuation(message);
  if (isAlreadyRussian(normalized)) {
    const parts = splitValidationParts(normalized);
    return parts.length > 1 ? formatValidationMessageList(parts) : normalized;
  }

  const parts = splitValidationParts(normalized);
  if (parts.length === 0) return normalized;

  const translated = parts.map((part) => translateKnownValidationLine(part) ?? part);
  const changed = translated.some((t, i) => t !== parts[i]);
  if (!changed && parts.length === 1) {
    const single = translateKnownValidationLine(normalized);
    return single ?? normalized;
  }
  return formatValidationMessageList(translated);
}

export function translateValidationMessageList(messages: string[]): string | string[] {
  const translated = messages.map((m) => translateValidationMessages(m));
  if (translated.length <= 1) {
    return translated[0] ?? 'Проверьте введённые данные.';
  }
  return translated;
}
