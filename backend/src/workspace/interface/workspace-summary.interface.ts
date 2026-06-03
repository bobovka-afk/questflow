import type { WorkspaceRole } from '../../generated/prisma/enums';
import type { WorkspacePermissions } from '../lib/member-permissions';

export interface WorkspaceSummary {
  id: number;
  name: string;
  description: string | null;
  myRole: WorkspaceRole | null;
  myPermissions: WorkspacePermissions | null;
}
