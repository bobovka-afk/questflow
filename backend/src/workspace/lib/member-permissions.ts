import { WorkspaceRole } from '../../generated/prisma/enums';

export type WorkspacePermissionKey =
  | 'inviteMembers'
  | 'manageBoards'
  | 'archiveBoards'
  | 'manageLabels'
  | 'manageMembers';

export type WorkspacePermissions = Record<WorkspacePermissionKey, boolean>;

export const WORKSPACE_PERMISSION_KEYS: WorkspacePermissionKey[] = [
  'inviteMembers',
  'manageBoards',
  'archiveBoards',
  'manageLabels',
  'manageMembers',
];

const ALL_TRUE: WorkspacePermissions = {
  inviteMembers: true,
  manageBoards: true,
  archiveBoards: true,
  manageLabels: true,
  manageMembers: true,
};

const ALL_FALSE: WorkspacePermissions = {
  inviteMembers: false,
  manageBoards: false,
  archiveBoards: false,
  manageLabels: false,
  manageMembers: false,
};

const ROLE_DEFAULTS: Record<WorkspaceRole, WorkspacePermissions> = {
  [WorkspaceRole.OWNER]: ALL_TRUE,
  [WorkspaceRole.ADMIN]: ALL_TRUE,
  [WorkspaceRole.MEMBER]: ALL_FALSE,
};

export function defaultPermissionsForRole(role: WorkspaceRole): WorkspacePermissions {
  return { ...ROLE_DEFAULTS[role] };
}

export function parsePermissionsOverrides(raw: unknown): Partial<WorkspacePermissions> {
  if (!raw || typeof raw !== 'object') return {};
  const o = raw as Record<string, unknown>;
  const out: Partial<WorkspacePermissions> = {};
  for (const key of WORKSPACE_PERMISSION_KEYS) {
    if (typeof o[key] === 'boolean') {
      out[key] = o[key];
    }
  }
  return out;
}

export function resolveMemberPermissions(
  role: WorkspaceRole,
  stored: unknown,
): WorkspacePermissions {
  if (role === WorkspaceRole.OWNER) {
    return { ...ALL_TRUE };
  }
  const base = defaultPermissionsForRole(role);
  const overrides = parsePermissionsOverrides(stored);
  return { ...base, ...overrides };
}

export function hasWorkspacePermission(
  role: WorkspaceRole,
  stored: unknown,
  key: WorkspacePermissionKey,
): boolean {
  return resolveMemberPermissions(role, stored)[key];
}
