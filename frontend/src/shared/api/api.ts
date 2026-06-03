import { translateValidationMessages } from '@shared/lib/validationMessagesRu';

export const API_URL =
  import.meta.env.VITE_API_URL?.toString() || 'http://localhost:3000';

export const RATE_LIMIT_MESSAGE_PREFIX = 'Слишком много попыток.';

export type ApiError = {
  status: number;
  message: string;
  raw?: unknown;
  code?: string;
  isRateLimit?: boolean;
};

const API_ERROR_CODE_RU: Record<string, string> = {
  EMAIL_ALREADY_EXISTS: 'Пользователь с таким email уже существует.',
  INVALID_REFRESH_TOKEN: 'Сессия истекла. Войдите снова.',
  SESSION_REVOKED: 'Сессия завершена. Войдите снова.',
  REFRESH_TOKEN_REQUIRED: 'Сессия недействительна. Войдите снова.',
  TOKEN_REQUIRED: 'Отсутствует токен подтверждения.',
  TOKEN_INVALID_OR_EXPIRED: 'Ссылка недействительна или истекла.',
  PASSWORD_REQUIRED: 'Введите пароль.',
  NEW_PASSWORD_REQUIRED: 'Введите новый пароль.',
  CURRENT_PASSWORD_REQUIRED: 'Введите текущий пароль.',
  PASSWORD_SHOULD_DIFFER: 'Новый пароль должен отличаться от текущего.',
  INVALID_CURRENT_PASSWORD: 'Текущий пароль указан неверно.',
  INVALID_CREDENTIALS: 'Неверный email или пароль.',
  USER_NOT_FOUND: 'Пользователь не найден.',
  ACCESS_DENIED: 'Нет доступа к этому профилю.',
  CHARACTER_VIEW_DISABLED: 'Пользователь скрыл просмотр персонажа.',
  EMAIL_UNCHANGED: 'Новый email совпадает с текущим.',
  CONFIRM_PHRASE_REQUIRED: 'Введите УДАЛИТЬ для подтверждения.',
  UNAUTHORIZED: 'Требуется авторизация.',
  WORKSPACE_ACTION_FORBIDDEN: 'Недостаточно прав для этого действия.',
  USER_ALREADY_MEMBER: 'Пользователь уже состоит в рабочем пространстве.',
  INVITE_ALREADY_SENT: 'Приглашение уже отправлено.',
  INVITE_NOT_FOUND: 'Приглашение не найдено.',
  INVITE_ACCESS_DENIED: 'Нет доступа к этому приглашению.',
  INVITE_ALREADY_PROCESSED: 'Приглашение уже обработано.',
  INVITE_EXPIRED: 'Срок действия приглашения истёк.',
  INVITE_MAIL_FAILED:
    'Не удалось отправить письмо с приглашением. Проверьте настройки почты и попробуйте снова.',
  SESSION_NOT_FOUND: 'Сессия не найдена.',
  RATE_LIMIT_EXCEEDED: `${RATE_LIMIT_MESSAGE_PREFIX} Подождите немного и повторите действие.`,
  CHARACTER_NOT_FOUND: 'Персонаж ещё не создан. Создайте его, чтобы продолжить.',
  CHARACTER_ALREADY_EXISTS: 'Персонаж для этого аккаунта уже создан.',
  CHARACTER_AVATAR_GENDER_MISMATCH:
    'Выберите аватар, который соответствует полу персонажа (мужские / женские варианты).',
  CHARACTER_UPDATE_FIELDS_REQUIRED: 'Укажите хотя бы одно поле для изменения.',
  XP_EVENT_ALREADY_RECORDED: 'Вы уже получали опыт за эту карточку.',
  DAILY_TASK_XP_LIMIT: 'Сегодня лимит опыта за карточки исчерпан.',
  CHECKIN_ALREADY_DONE: 'Сегодня серия за этот день уже засчитана.',
  XP_EVENT_DAY_KEY_REQUIRED: 'Для этого действия требуется игровой день.',
  CHEST_NOT_FOUND: 'Сундук не найден.',
  CHEST_ALREADY_OPENED: 'Этот сундук уже открыт.',
  COSMETIC_NOT_FOUND: 'Предмет не найден.',
  COSMETIC_NOT_OWNED: 'У вас нет этого предмета.',
  COSMETIC_EQUIP_NOT_SUPPORTED: 'Этот тип косметики нельзя надеть здесь.',
  COSMETIC_NOT_EQUIPPED: 'Этот предмет сейчас не надет.',
  COSMETIC_ALREADY_OWNED: 'У вас уже есть этот предмет.',
  COSMETIC_AVATAR_NOT_OWNED: 'Сначала получите этот образ из сундука.',
  AVATAR_PRESET_QUEST_NOT_ON_CREATE:
    'Квестовый образ нельзя выбрать при создании персонажа.',
  INSUFFICIENT_DUST: 'Недостаточно пыли для покупки сундука.',
  DUST_SHOP_TIER_INVALID: 'Недопустимый тип сундука.',
  FRIEND_CODE_INVALID: 'Код друга должен состоять из 4 цифр.',
  FRIEND_CODE_NOT_FOUND: 'Персонаж с таким кодом не найден.',
  FRIEND_REQUEST_SELF: 'Нельзя отправить заявку самому себе.',
  ALREADY_FRIENDS: 'Вы уже в списке друзей.',
  FRIEND_REQUEST_INCOMING_EXISTS: 'Этот игрок уже отправил вам заявку — примите её.',
  FRIEND_REQUEST_NOT_FOUND: 'Заявка в друзья не найдена.',
  FRIEND_REQUEST_NOT_PENDING: 'Заявка уже обработана.',
  FRIENDSHIP_NOT_FOUND: 'Дружба не найдена.',
  MESSAGE_NOT_ALLOWED: 'Писать можно только друзьям или коллегам из одного workspace.',
  MESSAGE_BODY_EMPTY: 'Сообщение не может быть пустым.',
  MESSAGE_BODY_TOO_LONG: 'Сообщение слишком длинное.',
  MESSAGE_SELF: 'Нельзя отправить сообщение самому себе.',
  FRIEND_CODE_GENERATION_FAILED: 'Не удалось сгенерировать игровой ID. Попробуйте позже.',
  BOSS_NOT_FOUND: 'Босс не найден.',
  PARTY_INVITE_EMPTY: 'Выберите хотя бы одного друга.',
  PARTY_SIZE_EXCEEDED: 'В пати не больше 8 игроков.',
  PARTY_NOT_FRIEND: 'В рейд можно приглашать только друзей.',
  PARTY_RAID_ALREADY_ACTIVE: 'Вы уже участвуете в рейде.',
  PARTY_RAID_NOT_FOUND: 'Рейд не найден.',
  PARTY_RAID_NOT_ACTIVE: 'Рейд не активен.',
  PARTY_RAID_NOT_INVITING: 'Рейд уже не принимает приглашения.',
  PARTY_NOT_LEADER: 'Только лидер может выполнить это действие.',
  PARTY_TOO_SMALL: 'Для старта нужно минимум 2 участника.',
  PARTY_NOT_ACTIVE_MEMBER: 'Вы не активный участник рейда.',
  MANA_INSUFFICIENT: 'Недостаточно маны для атаки. Закройте карточки на доске.',
  PARTY_CANNOT_KICK_LEADER: 'Лидера нельзя исключить.',
  PARTY_KICK_VOTE_OPEN: 'Голосование уже идёт.',
  PARTY_KICK_VOTE_NOT_FOUND: 'Голосование не найдено.',
  PARTY_KICK_VOTE_CLOSED: 'Голосование завершено.',
  PARTY_CANNOT_VOTE_ON_SELF: 'Нельзя голосовать за исключение себя.',
  PARTY_INVITE_NOT_PENDING: 'Приглашение уже обработано.',
  PARTY_MEMBER_NOT_FOUND: 'Вы не участник этого рейда.',
  PARTY_TARGET_NOT_ACTIVE: 'Игрок не в активном составе.',
};

function translateCommonEnglishError(message: string): string | null {
  const normalized = message.trim().toLowerCase();
  if (!normalized) return null;

  if (normalized.includes('current password is invalid')) {
    return 'Текущий пароль указан неверно.';
  }
  if (normalized.includes('current password is required')) {
    return 'Введите текущий пароль.';
  }
  if (normalized.includes('new password must be different')) {
    return 'Новый пароль должен отличаться от текущего.';
  }
  if (normalized.includes('new password is required')) {
    return 'Введите новый пароль.';
  }
  if (
    normalized.includes('invalid email or password') ||
    normalized.includes('invalid credentials')
  ) {
    return 'Неверный email или пароль.';
  }
  if (normalized.includes('token is invalid or expired')) {
    return 'Ссылка недействительна или истекла.';
  }
  if (normalized.includes('token is required')) {
    return 'Отсутствует токен подтверждения.';
  }
  if (normalized.includes('user with this email already exists')) {
    return 'Пользователь с таким email уже существует.';
  }
  if (normalized.includes('user not found')) {
    return 'Пользователь не найден.';
  }

  return null;
}

function formatRateLimitMessage() {
  return `${RATE_LIMIT_MESSAGE_PREFIX} Подождите немного и повторите действие.`;
}

function extractMessage(data: unknown): string {
  if (typeof data === 'string') return data;
  const payload = data as
    | { message?: unknown; code?: unknown }
    | undefined;
  if (typeof payload?.message === 'string') return payload.message;
  if (Array.isArray(payload?.message)) return payload.message.join(', ');
  if (
    payload?.message &&
    typeof payload.message === 'object' &&
    typeof (payload.message as { message?: unknown }).message === 'string'
  ) {
    return (payload.message as { message: string }).message;
  }
  return JSON.stringify(data);
}

async function readErrorPayload(res: Response): Promise<{ raw: unknown; message: string; code?: string }> {
  try {
    const data = await res.json();
    const payload = data as { code?: unknown };
    return {
      raw: data,
      message: extractMessage(data),
      code: typeof payload?.code === 'string' ? payload.code : undefined,
    };
  } catch {
    try {
      const text = await res.text();
      return { raw: text, message: text };
    } catch {
      const fallback = res.statusText || 'Request failed';
      return { raw: fallback, message: fallback };
    }
  }
}

let sessionExpiredHandler: (() => void) | null = null;

/** When set, invoked on HTTP 401 if the request sent `accessToken` (session invalid/expired). */
export function setSessionExpiredHandler(handler: (() => void) | null): void {
  sessionExpiredHandler = handler;
}

export function isRateLimitError(e: unknown): boolean {
  const err = e as Partial<ApiError>;
  return Boolean(err?.isRateLimit || err?.status === 429 || err?.code === 'RATE_LIMIT_EXCEEDED');
}

/**
 * Коды ошибок из `addExperience` при закрытии карточки: на сервере `isCompleted`
 * уже сохранён, откатывать галочку в UI не нужно.
 */
export function isXpGrantErrorCode(code?: string): boolean {
  return (
    code === 'CHARACTER_NOT_FOUND' ||
    code === 'XP_EVENT_ALREADY_RECORDED' ||
    code === 'DAILY_TASK_XP_LIMIT'
  );
}

/** Не модальное «ошибка», а мягкое оповещение (карточка на сервере уже закрыта). */
export function isXpTaskSoftNoticeCode(code?: string): boolean {
  return (
    code === 'XP_EVENT_ALREADY_RECORDED' ||
    code === 'DAILY_TASK_XP_LIMIT'
  );
}

function isNetworkFetchError(e: unknown): boolean {
  if (e instanceof TypeError) return true;
  const message = e instanceof Error ? e.message : String(e);
  return /failed to fetch|networkerror|load failed/i.test(message);
}

export function formatApiError(e: unknown): string {
  if (isNetworkFetchError(e)) {
    return 'Не удалось связаться с сервером. Проверьте, что backend запущен, и обновите страницу.';
  }
  if (isRateLimitError(e)) return formatRateLimitMessage();
  const err = e as Partial<ApiError>;
  if (typeof err?.code === 'string') {
    const byCode = API_ERROR_CODE_RU[err.code];
    if (byCode) return byCode;
  }
  if (typeof err?.message === 'string') {
    const translated = translateCommonEnglishError(err.message);
    if (translated) return translated;
    const validationRu = translateValidationMessages(err.message);
    if (validationRu !== err.message) return validationRu;
    return err.message;
  }
  return 'Ошибка запроса';
}

export function isRateLimitMessage(message: string | null | undefined): boolean {
  return typeof message === 'string' && message.startsWith(RATE_LIMIT_MESSAGE_PREFIX);
}

export async function api<T>(
  path: string,
  opts: RequestInit & {
    json?: unknown;
    accessToken?: string | null;
  } = {},
): Promise<T> {
  const headers = new Headers(opts.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (opts.json !== undefined) headers.set('Content-Type', 'application/json');
  if (opts.accessToken) headers.set('Authorization', `Bearer ${opts.accessToken}`);

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...opts,
      headers,
      body: opts.json !== undefined ? JSON.stringify(opts.json) : opts.body,
      credentials: 'include',
    });
  } catch (e) {
    const err: ApiError = {
      status: 0,
      message: isNetworkFetchError(e)
        ? 'Failed to fetch'
        : e instanceof Error
          ? e.message
          : 'Network error',
    };
    throw err;
  }

  if (!res.ok) {
    const payload = await readErrorPayload(res);
    if (res.status === 401 && opts.accessToken) {
      try {
        sessionExpiredHandler?.();
      } catch {
        /* ignore */
      }
    }
    const err: ApiError = {
      status: res.status,
      raw: payload.raw,
      code: payload.code,
      isRateLimit: res.status === 429 || payload.code === 'RATE_LIMIT_EXCEEDED',
      message:
        res.status === 429 || payload.code === 'RATE_LIMIT_EXCEEDED'
          ? formatRateLimitMessage()
          : payload.message,
    };
    throw err;
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

