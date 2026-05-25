import type { Request } from 'express';
export type AuthedRequest = Request & {
    user: {
        id: number;
    };
};
export type WorkspaceAuthedRequest = AuthedRequest & {
    workspaceId: number;
};
