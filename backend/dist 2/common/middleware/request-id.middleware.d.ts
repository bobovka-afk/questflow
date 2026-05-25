import { NextFunction, Request, Response } from 'express';
type RequestWithId = Request & {
    id?: string;
};
export declare function requestIdMiddleware(req: RequestWithId, res: Response, next: NextFunction): void;
export {};
