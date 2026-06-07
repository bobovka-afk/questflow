import { useCallback, useEffect, useMemo, useState } from 'react';
import { api, type ApiError } from '@shared/api';
import { SpaLink } from '@shared/lib/navigation';
import { navigate } from '@shared/lib/navigation-core';
import { canManageWorkspace, formatWorkspaceRole } from '@entities/workspace';

type WorkspaceMemberRow = {
  id: number;
  workspaceId: number;
  userId: number;
  role: string;
  createdAt: string;
  workspace: {
    id: number;
    name: string;
    description: string | null;
  };
};

type WorkspaceUpdateRes = {
  id: number;
  name: string;
  description: string | null;
};

type WorkspaceDetailStats = {
  boardCount: number | null;
  memberCount: number | null;
  loading: boolean;
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

function boardWord(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'доска';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'доски';
  return 'досок';
}

function memberWord(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'участник';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'участника';
  return 'участников';
}

type Props = { accessToken: string | null };

const WORKSPACES_PAGE_SIZE = 10;

export function WorkspacesPage({ accessToken }: Props) {
  const [rows, setRows] = useState<WorkspaceMemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [loadMoreBusy, setLoadMoreBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<number | null>(null);
  const [detailStats, setDetailStats] = useState<WorkspaceDetailStats>({
    boardCount: null,
    memberCount: null,
    loading: false,
  });

  const [createOpen, setCreateOpen] = useState(false);
  const [createName, setCreateName] = useState('');
  const [createDesc, setCreateDesc] = useState('');
  const [createBusy, setCreateBusy] = useState(false);

  const [editRow, setEditRow] = useState<WorkspaceMemberRow | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editBusy, setEditBusy] = useState(false);

  const [deleteRow, setDeleteRow] = useState<WorkspaceMemberRow | null>(null);
  const [deleteBusy, setDeleteBusy] = useState(false);

  const selectedRow = useMemo(
    () => rows.find((row) => row.workspace.id === selectedWorkspaceId) ?? null,
    [rows, selectedWorkspaceId],
  );

  const load = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      setRows([]);
      setHasMore(false);
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const data = await api<WorkspaceMemberRow[]>(
        `/workspace/get-user-workspaces?limit=${WORKSPACES_PAGE_SIZE}&offset=0`,
        {
          method: 'GET',
          accessToken,
        },
      );
      const list = Array.isArray(data) ? data : [];
      setRows(list);
      setHasMore(list.length === WORKSPACES_PAGE_SIZE);
    } catch (e) {
      setMsg(formatError(e));
      setRows([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const loadMore = useCallback(async () => {
    if (!accessToken || loadMoreBusy || !hasMore) return;
    setLoadMoreBusy(true);
    setMsg(null);
    try {
      const data = await api<WorkspaceMemberRow[]>(
        `/workspace/get-user-workspaces?limit=${WORKSPACES_PAGE_SIZE}&offset=${rows.length}`,
        {
          method: 'GET',
          accessToken,
        },
      );
      const chunk = Array.isArray(data) ? data : [];
      setRows((prev) => [...prev, ...chunk]);
      setHasMore(chunk.length === WORKSPACES_PAGE_SIZE);
    } catch (e) {
      setMsg(formatError(e));
    } finally {
      setLoadMoreBusy(false);
    }
  }, [accessToken, loadMoreBusy, hasMore, rows.length]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (rows.length === 0) {
      setSelectedWorkspaceId(null);
      return;
    }
    setSelectedWorkspaceId((current) => {
      if (current != null && rows.some((row) => row.workspace.id === current)) {
        return current;
      }
      return rows[0].workspace.id;
    });
  }, [rows]);

  useEffect(() => {
    if (!accessToken || selectedWorkspaceId == null) {
      setDetailStats({ boardCount: null, memberCount: null, loading: false });
      return;
    }

    let cancelled = false;
    setDetailStats((prev) => ({ ...prev, loading: true }));

    void (async () => {
      try {
        const [boards, members] = await Promise.all([
          api<unknown[]>(`/workspace/${selectedWorkspaceId}/boards`, {
            method: 'GET',
            accessToken,
          }),
          api<unknown[]>(
            `/workspace/${selectedWorkspaceId}/members?limit=100&offset=0`,
            { method: 'GET', accessToken },
          ),
        ]);
        if (cancelled) return;
        setDetailStats({
          boardCount: Array.isArray(boards) ? boards.length : 0,
          memberCount: Array.isArray(members) ? members.length : 0,
          loading: false,
        });
      } catch {
        if (!cancelled) {
          setDetailStats({ boardCount: null, memberCount: null, loading: false });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [accessToken, selectedWorkspaceId]);

  async function submitCreate() {
    if (!accessToken) return;
    setCreateBusy(true);
    setMsg(null);
    try {
      const body: { name: string; description?: string } = { name: createName.trim() };
      const d = createDesc.trim();
      if (d.length >= 3) body.description = d;

      await api('/workspace/create', {
        method: 'POST',
        accessToken,
        json: body,
      });
      setCreateOpen(false);
      setCreateName('');
      setCreateDesc('');
      await load();
    } catch (e) {
      setMsg(formatError(e));
    } finally {
      setCreateBusy(false);
    }
  }

  function openEdit(row: WorkspaceMemberRow) {
    setEditRow(row);
    setEditName(formatWorkspaceNameForUI(row.workspace.name));
    setEditDesc(row.workspace.description ?? '');
    setMsg(null);
  }

  function buildEditPatch(row: WorkspaceMemberRow, name: string, desc: string) {
    const json: { name?: string; description?: string } = {};
    const n = name.trim();
    const d = desc.trim();
    const currentName = formatWorkspaceNameForUI(row.workspace.name);
    if (n && n !== currentName) json.name = n;
    if (d.length >= 3 && d !== (row.workspace.description ?? '')) {
      json.description = d;
    }
    return json;
  }

  async function submitEdit() {
    if (!accessToken || !editRow) return;
    setEditBusy(true);
    setMsg(null);
    try {
      const json = buildEditPatch(editRow, editName, editDesc);
      if (Object.keys(json).length === 0) {
        setMsg('Нет изменений для сохранения.');
        setEditBusy(false);
        return;
      }

      const updated = await api<WorkspaceUpdateRes>(`/workspace/${editRow.workspace.id}`, {
        method: 'PATCH',
        accessToken,
        json,
      });

      setRows((prev) =>
        prev.map((r) =>
          r.workspace.id === updated.id
            ? {
                ...r,
                workspace: {
                  ...r.workspace,
                  name: updated.name,
                  description: updated.description,
                },
              }
            : r,
        ),
      );
      setEditRow(null);
    } catch (e) {
      setMsg(formatError(e));
    } finally {
      setEditBusy(false);
    }
  }

  async function confirmDelete() {
    if (!accessToken || !deleteRow) return;
    setDeleteBusy(true);
    setMsg(null);
    try {
      await api<{ ok: boolean }>(`/workspace/${deleteRow.workspace.id}`, {
        method: 'DELETE',
        accessToken,
      });
      setDeleteRow(null);
      await load();
    } catch (e) {
      setMsg(formatError(e));
    } finally {
      setDeleteBusy(false);
    }
  }

  const canCreate = createName.trim().length >= 3;
  const canEditSave =
    !!editRow &&
    editName.trim().length >= 3 &&
    Object.keys(buildEditPatch(editRow, editName, editDesc)).length > 0;

  return (
    <div className="px-page">
      <header className="px-topbar">
        <div className="px-topbar-left">
          <h1 className="px-topbar-title">Рабочие пространства</h1>
        </div>
        <div className="px-topbar-actions">
          {accessToken ? (
            <button
              type="button"
              className="px-btn px-btn--primary"
              onClick={() => {
                setCreateOpen(true);
                setMsg(null);
              }}
            >
              + Пространство
            </button>
          ) : null}
        </div>
      </header>

      <div className="px-content">
        {!accessToken && (
          <div className="trello-banner trello-banner-warn">
            Войдите на главной, чтобы управлять рабочими пространствами.
            <SpaLink className="trello-inline-link" to="/">
              На главную
            </SpaLink>
          </div>
        )}

        {msg && <div className="trello-banner trello-banner-error">{msg}</div>}

        {loading ? (
          <p className="px-empty">Загрузка…</p>
        ) : rows.length === 0 ? (
          accessToken ? (
            <div className="trello-workspaces-empty-grid">
              <button
                type="button"
                className="trello-board-tile trello-board-tile-add"
                onClick={() => {
                  setCreateOpen(true);
                  setMsg(null);
                }}
              >
                <span className="trello-board-tile-add-icon">+</span>
                <span>Создать рабочее пространство</span>
              </button>
            </div>
          ) : (
            <p className="px-empty">Пока нет рабочих пространств.</p>
          )
        ) : (
          <div className="px-ws-split">
            <div className="px-ws-list">
              <div className="px-ws-list-head">Выберите пространство</div>
              <div className="px-ws-list-scroll">
                {rows.map((row) => {
                  const workspaceId = row.workspace.id;
                  const isActive = workspaceId === selectedWorkspaceId;
                  return (
                    <button
                      key={row.id}
                      type="button"
                      className={
                        isActive
                          ? 'px-ws-item px-ws-item--active'
                          : 'px-ws-item'
                      }
                      title="Дважды нажмите, чтобы открыть доски"
                      onClick={() => setSelectedWorkspaceId(workspaceId)}
                      onDoubleClick={() => navigate(`/workspaces/${workspaceId}/boards`)}
                    >
                      {formatWorkspaceNameForUI(row.workspace.name)}
                      <div className="px-ws-item-sub">{formatWorkspaceRole(row.role)}</div>
                    </button>
                  );
                })}
              </div>
              {hasMore ? (
                <div className="px-ws-list-foot">
                  <button
                    type="button"
                    className="px-btn px-btn--ghost"
                    disabled={loadMoreBusy}
                    onClick={() => void loadMore()}
                  >
                    {loadMoreBusy ? 'Загрузка…' : 'Загрузить ещё'}
                  </button>
                </div>
              ) : null}
            </div>

            {selectedRow ? (
              <div className="px-ws-detail">
                <h2 className="px-ws-detail-title">
                  {formatWorkspaceNameForUI(selectedRow.workspace.name)}
                </h2>
                <p className="px-ws-detail-desc">
                  {selectedRow.workspace.description?.trim()
                    ? selectedRow.workspace.description
                    : 'Описание не задано.'}
                </p>
                <div className="px-ws-stats">
                  <div className="px-ws-stat">
                    {detailStats.loading || detailStats.boardCount == null ? (
                      'Загрузка…'
                    ) : (
                      <>
                        <strong>{detailStats.boardCount}</strong> {boardWord(detailStats.boardCount)}
                      </>
                    )}
                  </div>
                  <div className="px-ws-stat">
                    {detailStats.loading || detailStats.memberCount == null ? (
                      'Загрузка…'
                    ) : (
                      <>
                        <strong>{detailStats.memberCount}</strong>{' '}
                        {memberWord(detailStats.memberCount)}
                      </>
                    )}
                  </div>
                  <div className="px-ws-stat">
                    Роль: <strong>{formatWorkspaceRole(selectedRow.role)}</strong>
                  </div>
                </div>
                <div className="px-ws-detail-actions">
                  <SpaLink
                    className="px-btn px-btn--primary"
                    to={`/workspaces/${selectedRow.workspace.id}/boards`}
                  >
                    Открыть доски →
                  </SpaLink>
                  <SpaLink
                    className="px-btn px-btn--ghost"
                    to={`/workspaces/${selectedRow.workspace.id}/members`}
                  >
                    Участники
                  </SpaLink>
                  {canManageWorkspace(selectedRow.role) ? (
                    <>
                      <button
                        type="button"
                        className="px-btn px-btn--ghost"
                        onClick={() => openEdit(selectedRow)}
                      >
                        Изменить
                      </button>
                      {selectedRow.role === 'OWNER' ? (
                        <button
                          type="button"
                          className="px-btn px-btn--ghost px-btn--danger"
                          onClick={() => {
                            setDeleteRow(selectedRow);
                            setMsg(null);
                          }}
                        >
                          Удалить
                        </button>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      {createOpen && (
        <div className="trello-modal-backdrop" role="presentation" onClick={() => !createBusy && setCreateOpen(false)}>
          <div className="trello-modal" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
            <div className="trello-modal-head">
              <h2 className="trello-modal-title">Создать рабочее пространство</h2>
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
                <span className="trello-label">Название *</span>
                <input
                  className="trello-input"
                  value={createName}
                  onChange={(e) => setCreateName(e.target.value)}
                  maxLength={18}
                />
              </label>
              <label className="trello-field">
                <span className="trello-label">Описание</span>
                <textarea
                  className="trello-textarea"
                  value={createDesc}
                  onChange={(e) => setCreateDesc(e.target.value)}
                  rows={3}
                  maxLength={255}
                />
              </label>
            </div>
            <div className="trello-modal-foot">
              <button type="button" className="trello-btn trello-btn-ghost" onClick={() => !createBusy && setCreateOpen(false)}>
                Отмена
              </button>
              <button
                type="button"
                className="trello-btn trello-btn-ghost"
                disabled={!canCreate || createBusy}
                onClick={() => void submitCreate()}
              >
                {createBusy ? 'Создание…' : 'Создать'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editRow && (
        <div className="trello-modal-backdrop" role="presentation" onClick={() => !editBusy && setEditRow(null)}>
          <div className="trello-modal" role="dialog" aria-modal onClick={(e) => e.stopPropagation()}>
            <div className="trello-modal-head">
              <h2 className="trello-modal-title">Настройки рабочего пространства</h2>
              <button
                type="button"
                className="trello-modal-close"
                onClick={() => !editBusy && setEditRow(null)}
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
                  maxLength={18}
                />
              </label>
              <label className="trello-field">
                <span className="trello-label">Описание</span>
                <textarea
                  className="trello-textarea"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  maxLength={255}
                />
              </label>
            </div>
            <div className="trello-modal-foot">
              <button type="button" className="trello-btn trello-btn-ghost" onClick={() => !editBusy && setEditRow(null)}>
                Отмена
              </button>
              <button
                type="button"
                className="trello-btn trello-btn-primary"
                disabled={!canEditSave || editBusy}
                onClick={() => void submitEdit()}
              >
                {editBusy ? 'Сохранение…' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteRow && (
        <div className="trello-modal-backdrop" role="presentation" onClick={() => !deleteBusy && setDeleteRow(null)}>
          <div
            className="trello-modal trello-modal-narrow"
            role="dialog"
            aria-modal
            onClick={(e) => e.stopPropagation()}
          >
            <div className="trello-modal-head">
              <h2 className="trello-modal-title">Удалить рабочее пространство?</h2>
              <button
                type="button"
                className="trello-modal-close"
                onClick={() => !deleteBusy && setDeleteRow(null)}
                aria-label="Закрыть"
              >
                ×
              </button>
            </div>
            <div className="trello-modal-body">
              <p className="trello-confirm-text">
                Рабочее пространство «<strong>{formatWorkspaceNameForUI(deleteRow.workspace.name)}</strong>» будет удалено без возможности восстановления.
              </p>
            </div>
            <div className="trello-modal-foot">
              <button type="button" className="trello-btn trello-btn-ghost" onClick={() => !deleteBusy && setDeleteRow(null)}>
                Отмена
              </button>
              <button
                type="button"
                className="trello-btn trello-btn-danger"
                disabled={deleteBusy}
                onClick={() => void confirmDelete()}
              >
                {deleteBusy ? 'Удаление…' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
