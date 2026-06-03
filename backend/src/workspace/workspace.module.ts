import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { WorkspaceController } from './workspace.controller';
import { WorkspaceFeaturesController } from './workspace-features.controller';
import { WorkspaceSearchService } from './workspace-search.service';
import { WorkspaceLabelService } from './workspace-label.service';
import { WorkspacePermissionGuard } from '../common/guards/workspace-permission.guard';
import { PrismaModule } from '../prisma/prisma.module';
import { WorkspaceActivityModule } from '../workspace-activity/workspace-activity.module';
import { WorkspaceAccessGuard } from '../common/guards/workspace-access.guard';
import { WorkspaceRoleGuard } from '../common/guards/workspace-role.guard';
import { WorkspaceResourceGuard } from '../common/guards/workspace-resource.guard';
import { WorkspaceContextResolver } from '../common/services/workspace-context.resolver';

@Module({
  imports: [PrismaModule, WorkspaceActivityModule],
  controllers: [WorkspaceController, WorkspaceFeaturesController],
  providers: [
    WorkspaceService,
    WorkspaceSearchService,
    WorkspaceLabelService,
    WorkspaceAccessGuard,
    WorkspaceRoleGuard,
    WorkspacePermissionGuard,
    WorkspaceResourceGuard,
    WorkspaceContextResolver,
  ],
  exports: [
    WorkspaceService,
    WorkspaceSearchService,
    WorkspaceLabelService,
    WorkspaceAccessGuard,
    WorkspaceRoleGuard,
    WorkspacePermissionGuard,
    WorkspaceResourceGuard,
    WorkspaceContextResolver,
  ],
})
export class WorkspaceModule {}
