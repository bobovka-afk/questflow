import { useEffect, useId, useRef, useState } from 'react';

export type ThemedSelectOption = {
  value: string;
  label: string;
};

type Props = {
  value: string;
  options: ThemedSelectOption[];
  onChange: (value: string) => void;
  disabled?: boolean;
  emptyOption?: ThemedSelectOption;
  includeEmptyOption?: boolean;
  className?: string;
  'aria-label'?: string;
};

export function ThemedSelect({
  value,
  options,
  onChange,
  disabled = false,
  emptyOption = { value: '', label: 'Не назначен' },
  includeEmptyOption = true,
  className,
  'aria-label': ariaLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const allOptions = includeEmptyOption ? [emptyOption, ...options] : options;
  const selected =
    allOptions.find((o) => o.value === value) ??
    emptyOption;

  useEffect(() => {
    if (!open) return;
    function onDocPointer(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('pointerdown', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={['trello-themed-select', className].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        className="trello-themed-select__trigger trello-input trello-card-assignee-select"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        <span className="trello-themed-select__value">{selected.label}</span>
        <span className="trello-themed-select__chevron" aria-hidden />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="trello-themed-select__menu"
          aria-label={ariaLabel}
        >
          {allOptions.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value === '' ? '__empty' : opt.value} role="none">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={
                    isSelected
                      ? 'trello-themed-select__option trello-themed-select__option--selected'
                      : 'trello-themed-select__option'
                  }
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                >
                  {opt.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
