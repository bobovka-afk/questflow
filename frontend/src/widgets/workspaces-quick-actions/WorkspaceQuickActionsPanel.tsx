import type { RefObject } from 'react';
import { SpaLink } from '@shared/lib/navigation';
import { canManageWorkspace } from '@entities/workspace';

type WorkspaceRow = {
  role: string;
  workspace: {
    id: number;
    name: string;
  };
};

type Props = {
  row: WorkspaceRow;
  displayName: string;
  canRename: boolean;
  nameEditing: boolean;
  editName: string;
  renameBusy: boolean;
  titleInputRef: RefObject<HTMLInputElement | null>;
  onStartRename: () => void;
  onEditNameChange: (value: string) => void;
  onSaveRename: () => void;
  onCancelRename: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onSearchOpen: () => void;
};

export function WorkspaceQuickActionsPanel({
  row,
  displayName,
  canRename,
  nameEditing,
  editName,
  renameBusy,
  titleInputRef,
  onStartRename,
  onEditNameChange,
  onSaveRename,
  onCancelRename,
  onEdit,
  onDelete,
  onSearchOpen,
}: Props) {
  const workspaceId = row.workspace.id;
  const canManage = canManageWorkspace(row.role);
  const isOwner = row.role === 'OWNER';

  return (
    <aside className="px-ws-quick-panel" aria-label="Быстрые действия">
      <header className="px-ws-quick-head">
        {nameEditing ? (
          <input
            ref={titleInputRef}
            className="px-ws-quick-title-input"
            value={editName}
            disabled={renameBusy}
            aria-label="Название рабочего пространства"
            maxLength={18}
            onChange={(e) => onEditNameChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                void onSaveRename();
              }
              if (e.key === 'Escape') {
                e.preventDefault();
                onCancelRename();
              }
            }}
            onBlur={() => void onSaveRename()}
          />
        ) : (
          <button
            type="button"
            className="px-ws-quick-title-hit"
            disabled={!canRename || renameBusy}
            title={canRename ? 'Изменить название' : undefined}
            onClick={onStartRename}
          >
            <span className="px-ws-quick-title">{displayName}</span>
          </button>
        )}
      </header>
      <div className="px-ws-quick-grid">
        <SpaLink
          className="px-ws-quick-action"
          to={`/workspaces/${workspaceId}/boards`}
        >
          <span className="px-ws-quick-action-icon" aria-hidden>
            📋
          </span>
          <span className="px-ws-quick-action-label">Доски</span>
        </SpaLink>
        <SpaLink
          className="px-ws-quick-action"
          to={`/workspaces/${workspaceId}/members`}
        >
          <span className="px-ws-quick-action-icon" aria-hidden>
            👥
          </span>
          <span className="px-ws-quick-action-label">Участники</span>
        </SpaLink>
        {canManage ? (
          <button type="button" className="px-ws-quick-action" onClick={onEdit}>
            <span className="px-ws-quick-action-icon" aria-hidden>
              ⚙️
            </span>
            <span className="px-ws-quick-action-label">Настройки</span>
          </button>
        ) : null}
        <button type="button" className="px-ws-quick-action" onClick={onSearchOpen}>
          <span className="px-ws-quick-action-icon" aria-hidden>
            🔍
          </span>
          <span className="px-ws-quick-action-label">Поиск</span>
        </button>
        {canManage ? (
          <SpaLink
            className="px-ws-quick-action"
            to={`/workspaces/${workspaceId}/activity`}
          >
            <span className="px-ws-quick-action-icon" aria-hidden>
              📊
            </span>
            <span className="px-ws-quick-action-label">Активность</span>
          </SpaLink>
        ) : null}
        {isOwner ? (
          <button
            type="button"
            className="px-ws-quick-action px-ws-quick-action--danger"
            onClick={onDelete}
          >
            <span className="px-ws-quick-action-icon" aria-hidden>
              🗑️
            </span>
            <span className="px-ws-quick-action-label">Удалить</span>
          </button>
        ) : null}
      </div>
    </aside>
  );
}

export function WorkspaceQuickActionsPlaceholder() {
  return (
    <aside className="px-ws-quick-panel px-ws-quick-panel--empty" aria-hidden>
      <p className="px-ws-quick-empty">
        Раскройте пространство стрелкой — здесь появятся быстрые действия.
      </p>
    </aside>
  );
}
