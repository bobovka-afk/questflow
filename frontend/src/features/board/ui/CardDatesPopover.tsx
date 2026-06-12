import { useMemo, useState } from 'react';
import { CARD_REMINDER_OPTIONS } from '../lib/boardCardFilters';
import {
  MONTH_LABELS_RU,
  WEEKDAY_LABELS_RU,
  buildCalendarMonth,
  formatDateRu,
  formatTimeRu,
  isSameDay,
  mergeDateAndTime,
  parseDateRu,
  parseInputValue,
  toInputValue,
} from '../lib/cardDatesUtils';

type Props = {
  due: string;
  reminder: string;
  busy?: boolean;
  onClose: () => void;
  onSave: (due: string, reminder: string) => void | Promise<void>;
  onRemove: () => void | Promise<void>;
};

function IconChevron({ dir }: { dir: 'left' | 'right' | 'dbl-left' | 'dbl-right' }) {
  const paths: Record<typeof dir, string> = {
    'dbl-left': 'M6 6 L2 10 L6 14 M12 6 L8 10 L12 14',
    left: 'M10 6 L6 10 L10 14',
    right: 'M6 6 L10 10 L6 14',
    'dbl-right': 'M2 6 L6 10 L2 14 M8 6 L12 10 L8 14',
  };
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" aria-hidden>
      <path
        d={paths[dir]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CardDatesPopover({ due, reminder, busy, onClose, onSave, onRemove }: Props) {
  const initialDue = parseInputValue(due);
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const [dueEnabled, setDueEnabled] = useState(Boolean(due.trim()));
  const [draftDue, setDraftDue] = useState(due);
  const [draftReminder, setDraftReminder] = useState(reminder);
  const [dateText, setDateText] = useState(() =>
    initialDue ? formatDateRu(initialDue) : '',
  );
  const [timeText, setTimeText] = useState(() =>
    initialDue ? formatTimeRu(initialDue) : '12:00',
  );

  const selectedDue = parseInputValue(draftDue);
  const viewAnchor = selectedDue ?? today;
  const [viewYear, setViewYear] = useState(viewAnchor.getFullYear());
  const [viewMonth, setViewMonth] = useState(viewAnchor.getMonth());

  const calendarCells = useMemo(
    () => buildCalendarMonth(viewYear, viewMonth),
    [viewYear, viewMonth],
  );

  function applyDueDate(next: Date) {
    const merged = mergeDateAndTime(
      next,
      selectedDue?.getHours() ?? parseTimeParts(timeText).hours,
      selectedDue?.getMinutes() ?? parseTimeParts(timeText).minutes,
    );
    setDraftDue(toInputValue(merged));
    setDateText(formatDateRu(merged));
    setTimeText(formatTimeRu(merged));
    setDueEnabled(true);
    setViewYear(merged.getFullYear());
    setViewMonth(merged.getMonth());
  }

  function parseTimeParts(text: string): { hours: number; minutes: number } {
    const m = /^(\d{1,2}):(\d{2})$/.exec(text.trim());
    if (!m) return { hours: 12, minutes: 0 };
    return {
      hours: Math.min(23, Math.max(0, Number(m[1]))),
      minutes: Math.min(59, Math.max(0, Number(m[2]))),
    };
  }

  function commitDateText() {
    const parsed = parseDateRu(dateText);
    if (!parsed) {
      if (selectedDue) setDateText(formatDateRu(selectedDue));
      return;
    }
    applyDueDate(parsed);
  }

  function shiftMonth(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function shiftYear(delta: number) {
    setViewYear((y) => y + delta);
  }

  async function handleSave() {
    if (!dueEnabled) {
      await onSave('', '');
      onClose();
      return;
    }
    const parsedDate = parseDateRu(dateText) ?? selectedDue ?? today;
    const { hours, minutes } = parseTimeParts(timeText);
    const merged = mergeDateAndTime(parsedDate, hours, minutes);
    const finalDue = toInputValue(merged);
    await onSave(finalDue, draftReminder);
    onClose();
  }

  async function handleRemove() {
    await onRemove();
    onClose();
  }

  return (
    <div
      className="trello-card-dates-popover trello-card-detail-popover trello-card-detail-popover--dates"
      role="dialog"
      aria-label="Даты"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="trello-card-dates-popover-head">
        <span className="trello-card-dates-popover-title">Даты</span>
        <button
          type="button"
          className="trello-card-dates-popover-close"
          aria-label="Закрыть"
          onClick={onClose}
          disabled={busy}
        >
          ×
        </button>
      </div>

      <div className="trello-card-dates-calendar">
        <div className="trello-card-dates-calendar-nav">
          <button
            type="button"
            className="trello-card-dates-calendar-nav-btn"
            aria-label="Предыдущий год"
            disabled={busy}
            onClick={() => shiftYear(-1)}
          >
            <IconChevron dir="dbl-left" />
          </button>
          <button
            type="button"
            className="trello-card-dates-calendar-nav-btn"
            aria-label="Предыдущий месяц"
            disabled={busy}
            onClick={() => shiftMonth(-1)}
          >
            <IconChevron dir="left" />
          </button>
          <span className="trello-card-dates-calendar-month">
            {MONTH_LABELS_RU[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            className="trello-card-dates-calendar-nav-btn"
            aria-label="Следующий месяц"
            disabled={busy}
            onClick={() => shiftMonth(1)}
          >
            <IconChevron dir="right" />
          </button>
          <button
            type="button"
            className="trello-card-dates-calendar-nav-btn"
            aria-label="Следующий год"
            disabled={busy}
            onClick={() => shiftYear(1)}
          >
            <IconChevron dir="dbl-right" />
          </button>
        </div>

        <div className="trello-card-dates-weekdays" aria-hidden>
          {WEEKDAY_LABELS_RU.map((label) => (
            <span key={label} className="trello-card-dates-weekday">
              {label}
            </span>
          ))}
        </div>

        <div className="trello-card-dates-grid" role="grid" aria-label="Календарь">
          {calendarCells.map(({ date, inMonth }) => {
            const isToday = isSameDay(date, today);
            const isSelected = selectedDue != null && isSameDay(date, selectedDue);
            return (
              <button
                key={date.toISOString()}
                type="button"
                role="gridcell"
                className={[
                  'trello-card-dates-day',
                  !inMonth ? 'trello-card-dates-day--outside' : '',
                  isToday ? 'trello-card-dates-day--today' : '',
                  isSelected ? 'trello-card-dates-day--selected' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={busy}
                aria-label={formatDateRu(date)}
                aria-selected={isSelected}
                onClick={() => applyDueDate(date)}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <div className="trello-card-dates-field-row trello-card-dates-field-row--disabled">
        <label className="trello-card-dates-check">
          <input type="checkbox" disabled aria-disabled />
          <span>Начало</span>
        </label>
        <input
          className="trello-card-dates-input trello-card-dates-input--date"
          type="text"
          placeholder="д.м.гггг"
          disabled
          aria-disabled
          tabIndex={-1}
        />
      </div>

      <div className="trello-card-dates-field-row">
        <label className="trello-card-dates-check">
          <input
            type="checkbox"
            checked={dueEnabled}
            disabled={busy}
            onChange={(e) => setDueEnabled(e.target.checked)}
          />
          <span>Срок</span>
        </label>
        <input
          className="trello-card-dates-input trello-card-dates-input--date"
          type="text"
          placeholder="д.м.гггг"
          value={dateText}
          disabled={busy || !dueEnabled}
          onChange={(e) => setDateText(e.target.value)}
          onBlur={() => commitDateText()}
        />
        <input
          className="trello-card-dates-input trello-card-dates-input--time"
          type="time"
          value={timeText.length === 5 ? timeText : '12:00'}
          disabled={busy || !dueEnabled}
          onChange={(e) => {
            setTimeText(e.target.value);
            const parts = parseTimeParts(e.target.value);
            const base = selectedDue ?? today;
            const merged = mergeDateAndTime(base, parts.hours, parts.minutes);
            setDraftDue(toInputValue(merged));
            setDueEnabled(true);
          }}
        />
      </div>

      <label className="trello-card-dates-select-row trello-card-dates-select-row--disabled">
        <span className="trello-card-dates-select-label">Повторяется</span>
        <select className="trello-card-dates-select" disabled aria-disabled tabIndex={-1}>
          <option>Никогда</option>
        </select>
      </label>

      <label className="trello-card-dates-select-row">
        <span className="trello-card-dates-select-label">Установить напоминание</span>
        <select
          className="trello-card-dates-select"
          value={draftReminder}
          disabled={busy || !dueEnabled}
          onChange={(e) => setDraftReminder(e.target.value)}
        >
          {CARD_REMINDER_OPTIONS.map((o) => (
            <option key={o.value || 'none'} value={o.value}>
              {o.value === '1440' ? 'за 1 день' : o.label.toLowerCase()}
            </option>
          ))}
        </select>
      </label>

      <p className="trello-card-dates-hint">
        Участники и подписчики этой карточки получат напоминания.
      </p>

      <button
        type="button"
        className="trello-card-dates-save-btn"
        disabled={busy}
        onClick={() => void handleSave()}
      >
        Сохранить
      </button>
      <button
        type="button"
        className="trello-card-dates-remove-btn"
        disabled={busy || (!due.trim() && !reminder.trim())}
        onClick={() => void handleRemove()}
      >
        Удалить
      </button>
    </div>
  );
}
