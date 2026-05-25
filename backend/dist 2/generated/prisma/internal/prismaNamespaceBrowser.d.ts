import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models';
export type * from './prismaNamespace';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly AuthToken: "AuthToken";
    readonly Workspace: "Workspace";
    readonly WorkspaceMember: "WorkspaceMember";
    readonly WorkspaceInvite: "WorkspaceInvite";
    readonly WorkspaceActivity: "WorkspaceActivity";
    readonly Board: "Board";
    readonly List: "List";
    readonly Card: "Card";
    readonly Comment: "Comment";
    readonly Character: "Character";
    readonly XpEvent: "XpEvent";
    readonly HealthEvent: "HealthEvent";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly passwordHash: "passwordHash";
    readonly name: "name";
    readonly avatarPath: "avatarPath";
    readonly emailVerifiedAt: "emailVerifiedAt";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const AuthTokenScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly tokenHash: "tokenHash";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
    readonly usedAt: "usedAt";
};
export type AuthTokenScalarFieldEnum = (typeof AuthTokenScalarFieldEnum)[keyof typeof AuthTokenScalarFieldEnum];
export declare const WorkspaceScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type WorkspaceScalarFieldEnum = (typeof WorkspaceScalarFieldEnum)[keyof typeof WorkspaceScalarFieldEnum];
export declare const WorkspaceMemberScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly userId: "userId";
    readonly role: "role";
    readonly createdAt: "createdAt";
};
export type WorkspaceMemberScalarFieldEnum = (typeof WorkspaceMemberScalarFieldEnum)[keyof typeof WorkspaceMemberScalarFieldEnum];
export declare const WorkspaceInviteScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly workspaceId: "workspaceId";
    readonly invitedByUserId: "invitedByUserId";
    readonly tokenHash: "tokenHash";
    readonly role: "role";
    readonly status: "status";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type WorkspaceInviteScalarFieldEnum = (typeof WorkspaceInviteScalarFieldEnum)[keyof typeof WorkspaceInviteScalarFieldEnum];
export declare const WorkspaceActivityScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly actorUserId: "actorUserId";
    readonly type: "type";
    readonly payload: "payload";
    readonly createdAt: "createdAt";
};
export type WorkspaceActivityScalarFieldEnum = (typeof WorkspaceActivityScalarFieldEnum)[keyof typeof WorkspaceActivityScalarFieldEnum];
export declare const BoardScalarFieldEnum: {
    readonly id: "id";
    readonly workspaceId: "workspaceId";
    readonly name: "name";
    readonly description: "description";
    readonly position: "position";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type BoardScalarFieldEnum = (typeof BoardScalarFieldEnum)[keyof typeof BoardScalarFieldEnum];
export declare const ListScalarFieldEnum: {
    readonly id: "id";
    readonly boardId: "boardId";
    readonly name: "name";
    readonly position: "position";
    readonly colorPreset: "colorPreset";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type ListScalarFieldEnum = (typeof ListScalarFieldEnum)[keyof typeof ListScalarFieldEnum];
export declare const CardScalarFieldEnum: {
    readonly id: "id";
    readonly listId: "listId";
    readonly title: "title";
    readonly description: "description";
    readonly dueDate: "dueDate";
    readonly position: "position";
    readonly assigneeId: "assigneeId";
    readonly isCompleted: "isCompleted";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CardScalarFieldEnum = (typeof CardScalarFieldEnum)[keyof typeof CardScalarFieldEnum];
export declare const CommentScalarFieldEnum: {
    readonly id: "id";
    readonly cardId: "cardId";
    readonly userId: "userId";
    readonly body: "body";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CommentScalarFieldEnum = (typeof CommentScalarFieldEnum)[keyof typeof CommentScalarFieldEnum];
export declare const CharacterScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly name: "name";
    readonly gender: "gender";
    readonly avatarPreset: "avatarPreset";
    readonly currentXp: "currentXp";
    readonly level: "level";
    readonly health: "health";
    readonly dailyTaskXpCount: "dailyTaskXpCount";
    readonly checkinStreak: "checkinStreak";
    readonly lastCheckinDayKey: "lastCheckinDayKey";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type CharacterScalarFieldEnum = (typeof CharacterScalarFieldEnum)[keyof typeof CharacterScalarFieldEnum];
export declare const XpEventScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly type: "type";
    readonly cardId: "cardId";
    readonly dayKey: "dayKey";
    readonly xpAmount: "xpAmount";
    readonly createdAt: "createdAt";
};
export type XpEventScalarFieldEnum = (typeof XpEventScalarFieldEnum)[keyof typeof XpEventScalarFieldEnum];
export declare const HealthEventScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly dayKey: "dayKey";
    readonly delta: "delta";
    readonly reason: "reason";
    readonly createdAt: "createdAt";
};
export type HealthEventScalarFieldEnum = (typeof HealthEventScalarFieldEnum)[keyof typeof HealthEventScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
