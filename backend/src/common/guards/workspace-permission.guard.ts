import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { WORKSPACE_PERMISSION_KEY } from '../decorators/workspace-permission.decorator';
import {
  hasWorkspacePermission,
  type WorkspacePermissionKey,
} from '../../workspace/lib/member-permissions';

@Injectable()
export class WorkspacePermissionGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride<WorkspacePermissionKey>(
      WORKSPACE_PERMISSION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permission) {
      return true;
    }

    const req = context
      .switchToHttp()
      .getRequest<Request & { user?: { id?: number }; workspaceId?: number }>();
    const userId = req.user!.id!;
    const workspaceId = req.workspaceId!;

    const member = await this.prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: { workspaceId, userId },
      },
      select: { role: true, permissions: true },
    });

    if (
      !member ||
      !hasWorkspacePermission(member.role, member.permissions, permission)
    ) {
      throw new ForbiddenException({
        code: 'WORKSPACE_ACTION_FORBIDDEN',
        message:
          'You do not have permission to perform this action in this workspace.',
      });
    }

    return true;
  }
}
