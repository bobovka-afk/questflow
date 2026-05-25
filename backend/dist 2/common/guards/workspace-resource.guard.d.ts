import { CanActivate, ExecutionContext } from '@nestjs/common';
import { WorkspaceContextResolver } from '../services/workspace-context.resolver';
export declare class WorkspaceResourceGuard implements CanActivate {
    private readonly workspaceContextResolver;
    constructor(workspaceContextResolver: WorkspaceContextResolver);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private resolveWorkspaceIdFromParams;
}
