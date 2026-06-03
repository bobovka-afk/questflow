import { useCallback, useEffect, useState } from 'react';
import { AlertModal } from '@shared/ui/alert-modal/AlertModal';
import { api, type ApiError } from '@shared/api';
import {
  SpaLink,
} from '@shared/lib/navigation';
import { handleSpaTileAuxClick, handleSpaTileClick, navigate } from '@shared/lib/navigation-core';
import {
  canArchiveBoards,
  canManageBoards,
  canManageWorkspaceLegacy,
  type WorkspacePermissions,
} from '@entities/workspace';
import { ProfileToolbarAnchor } from '@shared/ui/profile-toolbar';
import { WorkspaceOnboardingBanner } from '@widgets/workspace-onboarding/WorkspaceOnboardingBanner';
import { WorkspaceSearchModal } from '@widgets/workspace-search/WorkspaceSearchModal';
import { useWorkspaceSearchHotkey } from '@shared/lib/useWorkspaceSearchHotkey';

export type BoardRow = {
  id: number;
  workspaceId: number;
  name: string;
  description: string | null;
  position: number;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

const BOARD_TEMPLATES = [
  { id: 'empty', label: 'Пустая' },
  { id: 'kanban-dev', label: 'Kanban (разработка)' },
  { id: 'backlog', label: 'Бэклог' },
] as const;

type Props = {
  accessToken: string | null;
  workspaceId: number;
};

function formatError(e: unknown) {
  const err = e as Partial<ApiError>;
  if (typeof err?.message === 'string') return err.message;
  return 'Ошибка запроса';
}

function formatWorkspaceNameForUI(name: string) {
  const m = name.match(/^\s*\d+\s*\((.*)\)\s*$/);
  return m ? m[1] : name;
}

function nextBoardPosition(rows: BoardRow[]): number {
  if (rows.length === 0) return 0;
  return rows.reduce((max, row) => (row.position > max ? row.position : max), rows[0].position) + 1;
}

const TILE_GRADIENTS = [
  'linear-gradient(135deg, #d29034 0%, #cd5a91 100%)',
  'linear-gradient(135deg, #61bd4f 0%, #2d8a54 100%)',
  'linear-gradient(135deg, #b04632 0%, #89609e 100%)',
  'linear-gradient(135deg, #89609e 0%, #cd5a91 100%)',
  'linear-gradient(135deg, #c3771d 0%, #b04632 100%)',
];

export function WorkspaceBoardsPage({ accessToken, workspaceId }: Props) {
  const [boards, setBoards] = useState<BoardRow[]>([]);
  const [workspaceTitle, setWorkspaceTitle] = useState<string>('');
  const [myRole, setMyRole] = useState<string | null>(null);
  const [myPermissions, setMyPermissions] = useState<WorkspacePermissions | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createTemplate, setCreateTemplate] = useState<string>('kanban-dev');
  const [archivedBoards, setArchivedBoards] = useState<BoardRow[]>([]);
  const [archiveOpen, setArchiveOpen] = useState(false);

  useWorkspaceSearchHotkey(() => setSearchOpen(true), Boolean(accessToken));
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertText, setAlertText] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createBusy, setCreateBusy] = useState(false);
  const [editBoard, setEditBoard] = useState<BoardRow | null>(null);
  const [editName, setEditName] = useState('');
  const [editBusy, setEditBusy] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<BoardRow | null>(null);
  const [deleteBoardBusy, setDeleteBoardBusy] = useState(false);

  const loadWorkspaceLabel = useCallback(async () => {
    if (!accessToken) {
      setMyRole(null);
      return;
    }
    try {
      const data = await api<{
        id: number;
        name: string;
        description: string | null;
        myRole: string | null;
        myPermissions: WorkspacePermissions | null;
      }>(`/workspace/${workspaceId}/summary`, { method: 'GET', accessToken });
      setWorkspaceTitle(formatWorkspaceNameForUI(data.name));
      setMyRole(data.myRole ?? null);
      setMyPermissions(data.myPermissions ?? null);
    } catch {
      setWorkspaceTitle(`Workspace ${workspaceId}`);
      setMyRole(null);
      setMyPermissions(null);
    }
  }, [accessToken, workspaceId]);

  const loadArchivedBoards = useCallback(async () => {
    if (!accessToken || !canArchiveBoards(myPermissions) && !canManageWorkspaceLegacy(myRole)) return;
    try {
      const data = await api<BoardRow[]>(
        `/workspace/${workspaceId}/boards/archived/list`,
        { method: 'GET', accessToken },
      );
      setArchivedBoards(Array.isArray(data) ? data : []);
    } catch {
      setArchivedBoards([]);
    }
  }, [accessToken, workspaceId, myPermissions, myRole]);

  const loadBoards = useCallback(async () => {
    if (!accessToken) {
      setBoards([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const data = await api<BoardRow[]>(
        `/workspace/${workspaceId}/boards`,
        { method: 'GET', accessToken },
      );
      setBoards(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg(formatError(e));
      setBoards([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, workspaceId]);

  useEffect(() => {
    void loadWorkspaceLabel();
  }, [loadWorkspaceLabel]);

  useEffect(() => {
    void loadBoards();
  }, [loadBoards]);

  useEffect(() => {
    if (archiveOpen) void loadArchivedBoards();
  }, [archiveOpen, loadArchivedBoards]);

  async function submitCreate() {
    if (!accessToken) return;
    const name = createName.trim();
    if (name.length < 3) return;
    const position = nextBoardPosition(boards);
    setCreateBusy(true);
    setMsg(null);
    try {
      await api(`/workspace/${workspaceId}/boards`, {
        method: 'POST',
        accessToken,
        json: { name, position, template: createTemplate },
      });
      setCreateOpen(false);
      setCreateName('');
      await loadBoards();
    } catch (e) {
      setAlertText(formatError(e));
      setAlertOpen(true);
    } finally {
      setCreateBusy(false);
    }
  }

  async function submitEditBoard() {
    if (!accessToken || !editBoard) return;
    const name = editName.trim();
    if (name.length < 3) return;
    setEditBusy(true);
    setMsg(null);
    try {
      await api(`/workspace/${workspaceId}/boards/${editBoard.id}`, {
        method: 'PATCH',
        accessToken,
        json: { name },
      });
      setEditBoard(null);
      await loadBoards();
    } catch (e) {
      setMsg(formatError(e));
    } finally {
      setEditBusy(false);
    }
  }

  const canManage = canManageBoards(myPermissions) || canManageWorkspaceLegacy(myRole);
  const canArchive = canArchiveBoards(myPermissions) || canManageWorkspaceLegacy(myRole);

  async function archiveBoardFromEdit() {
    if (!accessToken || !editBoard) return;
    await archiveBoardRow(editBoard);
    setEditBoard(null);
  }

  async function archiveBoardRow(b: BoardRow) {
    if (!accessToken) return;
    try {
      await api(`/workspace/${workspaceId}/boards/${b.id}/archive`, {
        method: 'PATCH',
        accessToken,
      });
      await loadBoards();
      await loadArchivedBoards();
    } catch (e) {
      setAlertText(formatError(e));
      setAlertOpen(true);
    }
  }

  async function restoreBoardRow(b: BoardRow) {
    if (!accessToken) return;
    try {
      await api(`/workspace/${workspaceId}/boards/${b.id}/unarchive`, {
        method: 'PATCH',
        accessToken,
      });
      await loadBoards();
      await loadArchivedBoards();
    } catch (e) {
      setAlertText(formatError(e));
      setAlertOpen(true);
    }
  }

  async function submitDeleteBoard() {
    if (!accessToken || !boardToDelete) return;
    setDeleteBoardBusy(true);
    setMsg(null);
    try {
      await api(`/workspace/${workspaceId}/boards/${boardToDelete.id}`, {
        method: 'DELETE',
        accessToken,
      });
      setBoardToDelete(null);
      setEditBoard(null);
      await loadBoards();
    } catch (e) {
      setMsg(formatError(e));
    } finally {
      setDeleteBoardBusy(false);
    }
  }

  return (
    <div className="trello-app-shell">
      <div className="trello-boards-main">
        <header className="trello-boards-topbar trello-topbar-stripe-3col trello-boards-topbar--sticky">
          <div className="trello-topbar-stripe-left">
            <SpaLink className="trello-top-left-brand trello-top-left-brand--stripe" to="/workspaces">
              <span className="trello-logo" aria-hidden />
              <span className="trello-top-left-brand-text">Questflow</span>
            </SpaLink>
          </div>
          <h1 className="trello-topbar-stripe-center">{workspaceTitle || '…'}</h1>
          <div className="trello-topbar-actions">
            <SpaLink
              className="trello-btn trello-btn-topbar-nav trello-topbar-back-btn"
              to="/workspaces"
            >
              ← Рабочие пространства
            </SpaLink>
            {accessToken ? (
              <>
                <button
                  type="button"
                  className="trello-btn trello-btn-ghost"
                  onClick={() => setSearchOpen(true)}
                  title="Поиск (⌘K / Ctrl+K)"
                >
                  Поиск
                </button>
                {canArchive ? (
                  <button
                    type="button"
                    className="trello-btn trello-btn-ghost"
                    onClick={() => setArchiveOpen((o) => !o)}
                  >
                    Архив
                  </button>
                ) : null}
                <ProfileToolbarAnchor />
              </>
            ) : null}
          </div>
        </header>

        {!accessToken && (
          <div className="trello-banner trello-banner-warn">
            Войдите на главной, чтобы видеть доски.
            <SpaLink className="trello-inline-link" to="/">
              Войти
            </SpaLink>
          </div>
        )}

        {msg && <div className="trello-banner trello-banner-error">{msg}</div>}

        {loading ? (
          <div className="trello-empty">Загрузка досок…</div>
        ) : boards.length === 0 && accessToken ? (
          <WorkspaceOnboardingBanner onCreateBoard={() => setCreateOpen(true)} />
        ) : (
          <div className="trello-boards-grid">
            {boards.map((b, i) => (
              <div
                key={b.id}
                className="trello-board-tile"
                style={{ background: TILE_GRADIENTS[i % TILE_GRADIENTS.length] }}
                onClick={(e) =>
                  handleSpaTileClick(e, `/workspaces/${workspaceId}/boards/${b.id}`)
                }
                onAuxClick={(e) =>
                  handleSpaTileAuxClick(e, `/workspaces/${workspaceId}/boards/${b.id}`)
                }
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/workspaces/${workspaceId}/boards/${b.id}`);
                  }
                }}
              >
                {canManage ? (
                  <button
                    type="button"
                    className="trello-board-tile-menu"
                    aria-label="Редактировать доску"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditBoard(b);
                      setEditName(b.name);
                      setMsg(null);
                    }}
                  >
                    ✎
                  </button>
                ) : null}
                <span className="trello-board-tile-name">{b.name}</span>
              </div>
            ))}
            {accessToken && (
              <button
                type="button"
                className="trello-board-tile trello-board-tile-add"
                onClick={() => {
                  setCreateOpen(true);
                  setMsg(null);
                }}
              >
                <span className="trello-board-tile-add-icon">+</span>
                <span>Создать доску</span>
              </button>
            )}
          </div>
        )}

        {archiveOpen && canArchive && (
          <section className="trello-ws-archived" aria-live="polite">
            <h2 className="trello-ws-archived-title">Архив досок</h2>
            {archivedBoards.length === 0 ? (
              <p className="trello-settings-card-hint">Архив пуст.</p>
            ) : null}
            {archivedBoards.length > 0 ? (
              <ul className="trello-ws-archived-list">
                {archivedBoards.map((b) => (
                  <li key={b.id}>
                    <span>{b.name}</span>
                    <button
                      type="button"
                      className="trello-btn trello-btn-sm trello-btn-ghost"
                      onClick={() => void restoreBoardRow(b)}
                    >
                      Восстановить
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        )}
      </div>

      {accessToken && (
        <WorkspaceSearchModal
          accessToken={accessToken}
          workspaceId={workspaceId}
          open={searchOpen}
          onClose={() => setSearchOpen(false)}
        />
      )}

      {createOpen && (
        <div
          className="trello-modal-backdrop"
          role="presentation"
          onClick={() => !createBusy && setCreateOpen(false)}
        >
          <div
            className="trello-modal"
            role="dialog"
            aria-modal
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trello-modal-head">
              <h2 className="trello-modal-title">Новая доска</h2>
              <button
                type="button"
                className="trello-modal-close"
                onClick={() => !createBusy && setCreateOpen(false)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="trello-modal-body">
              <label className="trello-field">
                <span className="trello-label">Название</span>
                <input
                  className="trello-input"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  maxLength={50}
                  autoFocus
                />
              </label>
              <label className="trello-field">
                <span className="trello-label">Шаблон</span>
                <select
                  className="trello-input"
                  value={createTemplate}
                  onChange={(e) => setCreateTemplate(e.target.value)}
                >
                  {BOARD_TEMPLATES.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="trello-modal-foot">
              <button
                type="button"
                className="trello-btn trello-btn-ghost"
                onClick={() => !createBusy && setCreateOpen(false)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="trello-btn trello-btn-primary"
                disabled={createName.trim().length < 3 || createBusy}
                onClick={() => void submitCreate()}
              >
                {createBusy ? 'Создание…' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}
      {editBoard && (
        <div
          className="trello-modal-backdrop"
          role="presentation"
          onClick={() => !editBusy && setEditBoard(null)}
        >
          <div
            className="trello-modal"
            role="dialog"
            aria-modal
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trello-modal-head">
              <h2 className="trello-modal-title">Редактировать доску</h2>
              <button
                type="button"
                className="trello-modal-close"
                onClick={() => !editBusy && setEditBoard(null)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="trello-modal-body">
              <label className="trello-field">
                <span className="trello-label">Название</span>
                <input
                  className="trello-input"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={50}
                  autoFocus
                />
              </label>
            </div>
            <div className="trello-modal-foot trello-modal-foot-split">
              <div className="trello-modal-foot-danger-group">
                {canArchive && (
                  <button
                    type="button"
                    className="trello-btn trello-btn-ghost"
                    disabled={editBusy || deleteBoardBusy}
                    onClick={() => void archiveBoardFromEdit()}
                  >
                    В архив
                  </button>
                )}
                <button
                  type="button"
                  className="trello-btn trello-btn-danger"
                  disabled={editBusy || deleteBoardBusy}
                  onClick={() => {
                    if (!editBoard || editBusy) return;
                    setBoardToDelete(editBoard);
                    setEditBoard(null);
                  }}
                >
                  Удалить
                </button>
              </div>
              <div className="trello-modal-foot-actions">
                <button
                  type="button"
                  className="trello-btn trello-btn-ghost"
                  onClick={() => !editBusy && setEditBoard(null)}
                >
                  Отмена
                </button>
                <button
                  type="button"
                  className="trello-btn trello-btn-primary"
                  disabled={editName.trim().length < 3 || editBusy}
                  onClick={() => void submitEditBoard()}
                >
                  {editBusy ? 'Сохранение…' : 'Сохранить'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <AlertModal
        open={alertOpen}
        message={alertText}
        onClose={() => setAlertOpen(false)}
      />

      {boardToDelete && (
        <div
          className="trello-modal-backdrop"
          role="presentation"
          onClick={() => !deleteBoardBusy && setBoardToDelete(null)}
        >
          <div
            className="trello-modal trello-modal-narrow"
            role="dialog"
            aria-modal
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trello-modal-head">
              <h2 className="trello-modal-title">Удалить доску?</h2>
              <button
                type="button"
                className="trello-modal-close"
                onClick={() => !deleteBoardBusy && setBoardToDelete(null)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="trello-modal-body">
              <p className="trello-confirm-text">
                Доска «<strong>{boardToDelete.name}</strong>» будет удалена без возможности восстановления.
              </p>
            </div>
            <div className="trello-modal-foot">
              <button
                type="button"
                className="trello-btn trello-btn-ghost"
                onClick={() => !deleteBoardBusy && setBoardToDelete(null)}
              >
                Отмена
              </button>
              <button
                type="button"
                className="trello-btn trello-btn-danger"
                disabled={deleteBoardBusy}
                onClick={() => void submitDeleteBoard()}
              >
                {deleteBoardBusy ? 'Удаление…' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
