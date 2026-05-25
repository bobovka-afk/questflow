import { WorkspaceRole } from '../../generated/prisma/enums';
export declare const WORKSPACE_ROLES_KEY = "workspace_roles";
export declare const WorkspaceRoles: (...roles: WorkspaceRole[]) => import("@nestjs/common").CustomDecorator<string>;
