import { SetMetadata } from '@nestjs/common';
import type { WorkspacePermissionKey } from '../../workspace/lib/member-permissions';

export const WORKSPACE_PERMISSION_KEY = 'workspacePermission';

export const WorkspacePermission = (permission: WorkspacePermissionKey) =>
  SetMetadata(WORKSPACE_PERMISSION_KEY, permission);
