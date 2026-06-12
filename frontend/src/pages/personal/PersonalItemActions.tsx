import { useEffect, useId, useRef, useState } from 'react';
import type { HabitPolarity } from '@entities/personal/model/types';

export type PersonalItemKind = 'habit' | 'daily' | 'todo';

const HABIT_POLARITY_OPTIONS: { value: HabitPolarity; label: string }[] = [
  { value: 'POSITIVE', label: 'Положительная (+)' },
  { value: 'NEGATIVE', label: 'Отрицательная (−)' },
  { value: 'BOTH', label: 'Обе (+/−)' },
];

const EDIT_TITLES: Record<PersonalItemKind, string> = {
  habit: 'Изменить привычку',
  daily: 'Изменить ежедневную задачу',
  todo: 'Изменить задачу',
};

const DELETE_TITLES: Record<PersonalItemKind, string> = {
  habit: 'Удалить привычку?',
  daily: 'Удалить ежедневную задачу?',
  todo: 'Удалить задачу?',
};

const DELETE_HINTS: Record<PersonalItemKind, string> = {
  habit: 'Исчезнет из списка. История отметок сохранится на сервере.',
  daily: 'Исчезнет из списка. Прогресс серии сохранится на сервере.',
  todo: 'Исчезнет из списка без выполнения.',
};

type PersonalCardMenuProps = {
  kind: PersonalItemKind;
  title: string;
  polarity?: HabitPolarity;
  busy: boolean;
  disabled?: boolean;
  onSave: (payload: { title: string; polarity?: HabitPolarity }) => Promise<void>;
  onDelete: () => Promise<void>;
};

export function PersonalCardMenu({
  kind,
  title,
  polarity,
  busy,
  disabled,
  onSave,
  onDelete,
}: PersonalCardMenuProps) {
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editPolarity, setEditPolarity] = useState<HabitPolarity>(polarity ?? 'POSITIVE');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [menuOpen]);

  useEffect(() => {
    if (!editOpen) return;
    setEditTitle(title);
    setEditPolarity(polarity ?? 'POSITIVE');
    editInputRef.current?.focus();
    editInputRef.current?.select();
  }, [editOpen, title, polarity]);

  function openEdit() {
    setMenuOpen(false);
    setEditOpen(true);
  }

  function openDelete() {
    setMenuOpen(false);
    setDeleteOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const nextTitle = editTitle.trim();
    if (!nextTitle || busy) return;
    if (kind === 'habit') {
      await onSave({ title: nextTitle, polarity: editPolarity });
    } else {
      await onSave({ title: nextTitle });
    }
    setEditOpen(false);
  }

  async function handleDeleteConfirm() {
    if (busy) return;
    await onDelete();
    setDeleteOpen(false);
  }

  return (
    <>
      <div className="personal-card-menu" ref={rootRef}>
        <button
          type="button"
          className="personal-card-menu-trigger"
          disabled={disabled || busy}
          aria-label={`Действия: ${title}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          ⋮
        </button>
        {menuOpen ? (
          <menu id={menuId} className="personal-card-menu-popover" aria-label="Действия">
            <li>
              <button type="button" onClick={openEdit}>
                Изменить
              </button>
            </li>
            <li>
              <button type="button" className="personal-card-menu-delete" onClick={openDelete}>
                Удалить
              </button>
            </li>
          </menu>
        ) : null}
      </div>

      {editOpen ? (
        <div
          className="trello-modal-backdrop"
          role="presentation"
          onClick={() => !busy && setEditOpen(false)}
        >
          <div
            className="trello-modal trello-modal--board-form personal-item-edit-modal"
            role="dialog"
            aria-modal
            aria-labelledby={`${menuId}-edit-title`}
            onClick={(e) => e.stopPropagation()}
          >
            <form className="personal-item-edit-form" onSubmit={(e) => void handleSave(e)}>
              <div className="trello-modal-head">
                <h2 id={`${menuId}-edit-title`} className="trello-modal-title">
                  {EDIT_TITLES[kind]}
                </h2>
                <button
                  type="button"
                  className="trello-modal-close"
                  disabled={busy}
                  aria-label="Закрыть"
                  onClick={() => setEditOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="trello-modal-body">
                <label className="trello-field">
                  <span className="trello-label">Название</span>
                  <input
                    ref={editInputRef}
                    className="trello-input personal-item-edit-input"
                    type="text"
                    value={editTitle}
                    maxLength={200}
                    disabled={busy}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        e.preventDefault();
                        setEditOpen(false);
                      }
                    }}
                  />
                </label>
                {kind === 'habit' ? (
                  <fieldset className="personal-habit-polarity personal-item-edit-polarity">
                    <legend className="personal-habit-polarity-legend">Тип привычки</legend>
                    <div className="personal-habit-polarity-options">
                      {HABIT_POLARITY_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className={
                            editPolarity === option.value
                              ? 'personal-habit-polarity-btn personal-habit-polarity-btn--active'
                              : 'personal-habit-polarity-btn'
                          }
                          disabled={busy}
                          aria-pressed={editPolarity === option.value}
                          onClick={() => setEditPolarity(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                ) : null}
              </div>
              <div className="trello-modal-foot">
                <button
                  type="button"
                  className="trello-btn trello-btn-ghost trello-btn-sm"
                  disabled={busy}
                  onClick={() => setEditOpen(false)}
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="trello-btn trello-btn-primary trello-btn-sm"
                  disabled={busy || !editTitle.trim()}
                >
                  {busy ? 'Сохранение…' : 'Сохранить'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {deleteOpen ? (
        <div
          className="trello-modal-backdrop"
          role="presentation"
          onClick={() => !busy && setDeleteOpen(false)}
        >
          <div
            className="trello-modal personal-item-delete-modal"
            role="dialog"
            aria-modal
            aria-labelledby={`${menuId}-delete-title`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trello-modal-head">
              <h2 id={`${menuId}-delete-title`} className="trello-modal-title">
                {DELETE_TITLES[kind]}
              </h2>
              <button
                type="button"
                className="trello-modal-close"
                disabled={busy}
                aria-label="Закрыть"
                onClick={() => setDeleteOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="trello-modal-body">
              <p className="trello-confirm-text">
                «<strong>{title}</strong>» {DELETE_HINTS[kind]}
              </p>
            </div>
            <div className="trello-modal-foot">
              <button
                type="button"
                className="trello-btn trello-btn-ghost trello-btn-sm"
                disabled={busy}
                onClick={() => setDeleteOpen(false)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="trello-btn trello-btn-danger trello-btn-sm"
                disabled={busy}
                onClick={() => void handleDeleteConfirm()}
              >
                {busy ? 'Удаление…' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
