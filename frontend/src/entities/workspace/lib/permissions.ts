export type WorkspacePermissions = {
  inviteMembers: boolean;
  manageBoards: boolean;
  archiveBoards: boolean;
  manageLabels: boolean;
  manageMembers: boolean;
};

export function canInviteMembers(perms: WorkspacePermissions | null | undefined): boolean {
  return perms?.inviteMembers ?? false;
}

export function canManageBoards(perms: WorkspacePermissions | null | undefined): boolean {
  return perms?.manageBoards ?? false;
}

export function canArchiveBoards(perms: WorkspacePermissions | null | undefined): boolean {
  return perms?.archiveBoards ?? false;
}

export function canManageLabels(perms: WorkspacePermissions | null | undefined): boolean {
  return perms?.manageLabels ?? false;
}

export function canManageMembers(perms: WorkspacePermissions | null | undefined): boolean {
  return perms?.manageMembers ?? false;
}

/** Fallback when summary has no permissions yet (legacy OWNER/ADMIN). */
export function canManageWorkspaceLegacy(role: string | null | undefined): boolean {
  return role === 'OWNER' || role === 'ADMIN';
}
