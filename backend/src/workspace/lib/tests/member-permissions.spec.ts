import { WorkspaceRole } from '../../../generated/prisma/enums';
import {
  hasWorkspacePermission,
  resolveMemberPermissions,
} from '../member-permissions';

describe('member-permissions', () => {
  it('owner always has all permissions', () => {
    const p = resolveMemberPermissions(WorkspaceRole.OWNER, {
      inviteMembers: false,
    });
    expect(p.inviteMembers).toBe(true);
    expect(hasWorkspacePermission(WorkspaceRole.OWNER, {}, 'manageBoards')).toBe(
      true,
    );
  });

  it('member defaults deny', () => {
    const p = resolveMemberPermissions(WorkspaceRole.MEMBER, null);
    expect(p.manageBoards).toBe(false);
  });

  it('admin overrides apply', () => {
    const p = resolveMemberPermissions(WorkspaceRole.ADMIN, {
      inviteMembers: false,
    });
    expect(p.inviteMembers).toBe(false);
    expect(p.manageBoards).toBe(true);
  });
});
