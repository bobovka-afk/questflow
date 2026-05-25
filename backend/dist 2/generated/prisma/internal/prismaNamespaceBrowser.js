"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.JsonNullValueInput = exports.SortOrder = exports.HealthEventScalarFieldEnum = exports.XpEventScalarFieldEnum = exports.CharacterScalarFieldEnum = exports.CommentScalarFieldEnum = exports.CardScalarFieldEnum = exports.ListScalarFieldEnum = exports.BoardScalarFieldEnum = exports.WorkspaceActivityScalarFieldEnum = exports.WorkspaceInviteScalarFieldEnum = exports.WorkspaceMemberScalarFieldEnum = exports.WorkspaceScalarFieldEnum = exports.AuthTokenScalarFieldEnum = exports.UserScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.Decimal = void 0;
const runtime = require("@prisma/client/runtime/index-browser");
exports.Decimal = runtime.Decimal;
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    User: 'User',
    AuthToken: 'AuthToken',
    Workspace: 'Workspace',
    WorkspaceMember: 'WorkspaceMember',
    WorkspaceInvite: 'WorkspaceInvite',
    WorkspaceActivity: 'WorkspaceActivity',
    Board: 'Board',
    List: 'List',
    Card: 'Card',
    Comment: 'Comment',
    Character: 'Character',
    XpEvent: 'XpEvent',
    HealthEvent: 'HealthEvent'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.UserScalarFieldEnum = {
    id: 'id',
    email: 'email',
    passwordHash: 'passwordHash',
    name: 'name',
    avatarPath: 'avatarPath',
    emailVerifiedAt: 'emailVerifiedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.AuthTokenScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    tokenHash: 'tokenHash',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    usedAt: 'usedAt'
};
exports.WorkspaceScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.WorkspaceMemberScalarFieldEnum = {
    id: 'id',
    workspaceId: 'workspaceId',
    userId: 'userId',
    role: 'role',
    createdAt: 'createdAt'
};
exports.WorkspaceInviteScalarFieldEnum = {
    id: 'id',
    email: 'email',
    workspaceId: 'workspaceId',
    invitedByUserId: 'invitedByUserId',
    tokenHash: 'tokenHash',
    role: 'role',
    status: 'status',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt'
};
exports.WorkspaceActivityScalarFieldEnum = {
    id: 'id',
    workspaceId: 'workspaceId',
    actorUserId: 'actorUserId',
    type: 'type',
    payload: 'payload',
    createdAt: 'createdAt'
};
exports.BoardScalarFieldEnum = {
    id: 'id',
    workspaceId: 'workspaceId',
    name: 'name',
    description: 'description',
    position: 'position',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.ListScalarFieldEnum = {
    id: 'id',
    boardId: 'boardId',
    name: 'name',
    position: 'position',
    colorPreset: 'colorPreset',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CardScalarFieldEnum = {
    id: 'id',
    listId: 'listId',
    title: 'title',
    description: 'description',
    dueDate: 'dueDate',
    position: 'position',
    assigneeId: 'assigneeId',
    isCompleted: 'isCompleted',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CommentScalarFieldEnum = {
    id: 'id',
    cardId: 'cardId',
    userId: 'userId',
    body: 'body',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CharacterScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    name: 'name',
    gender: 'gender',
    avatarPreset: 'avatarPreset',
    currentXp: 'currentXp',
    level: 'level',
    health: 'health',
    dailyTaskXpCount: 'dailyTaskXpCount',
    checkinStreak: 'checkinStreak',
    lastCheckinDayKey: 'lastCheckinDayKey',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.XpEventScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    type: 'type',
    cardId: 'cardId',
    dayKey: 'dayKey',
    xpAmount: 'xpAmount',
    createdAt: 'createdAt'
};
exports.HealthEventScalarFieldEnum = {
    id: 'id',
    userId: 'userId',
    dayKey: 'dayKey',
    delta: 'delta',
    reason: 'reason',
    createdAt: 'createdAt'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
//# sourceMappingURL=prismaNamespaceBrowser.js.map