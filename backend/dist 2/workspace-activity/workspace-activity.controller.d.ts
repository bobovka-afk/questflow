import { PaginationDto } from '../workspace/dto/pagination.dto';
import { WorkspaceActivityService } from './workspace-activity.service';
import type { WorkspaceActivityListItem } from './interface';
export declare class WorkspaceActivityController {
    private readonly workspaceActivityService;
    constructor(workspaceActivityService: WorkspaceActivityService);
    listWorkspaceActivity(workspaceId: number, paginationDto: PaginationDto): Promise<WorkspaceActivityListItem[]>;
}
