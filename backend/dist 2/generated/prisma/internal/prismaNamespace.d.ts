import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
export declare const prismaVersion: PrismaVersion;
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: runtime.DbNullClass;
export declare const JsonNull: runtime.JsonNullClass;
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
};
export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
type AtStrict<O extends object, K extends Key> = O[K & keyof O];
type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
    1: AtStrict<O, K>;
    0: AtLoose<O, K>;
}[strict];
export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
} & {};
export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
} & {};
type _Record<K extends keyof any, T> = {
    [P in K]: T;
};
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
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
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "user" | "authToken" | "workspace" | "workspaceMember" | "workspaceInvite" | "workspaceActivity" | "board" | "list" | "card" | "comment" | "character" | "xpEvent" | "healthEvent";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        AuthToken: {
            payload: Prisma.$AuthTokenPayload<ExtArgs>;
            fields: Prisma.AuthTokenFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.AuthTokenFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.AuthTokenFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>;
                };
                findFirst: {
                    args: Prisma.AuthTokenFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.AuthTokenFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>;
                };
                findMany: {
                    args: Prisma.AuthTokenFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>[];
                };
                create: {
                    args: Prisma.AuthTokenCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>;
                };
                createMany: {
                    args: Prisma.AuthTokenCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.AuthTokenCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>[];
                };
                delete: {
                    args: Prisma.AuthTokenDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>;
                };
                update: {
                    args: Prisma.AuthTokenUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>;
                };
                deleteMany: {
                    args: Prisma.AuthTokenDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.AuthTokenUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.AuthTokenUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>[];
                };
                upsert: {
                    args: Prisma.AuthTokenUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$AuthTokenPayload>;
                };
                aggregate: {
                    args: Prisma.AuthTokenAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateAuthToken>;
                };
                groupBy: {
                    args: Prisma.AuthTokenGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuthTokenGroupByOutputType>[];
                };
                count: {
                    args: Prisma.AuthTokenCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AuthTokenCountAggregateOutputType> | number;
                };
            };
        };
        Workspace: {
            payload: Prisma.$WorkspacePayload<ExtArgs>;
            fields: Prisma.WorkspaceFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkspaceFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkspaceFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                findFirst: {
                    args: Prisma.WorkspaceFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkspaceFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                findMany: {
                    args: Prisma.WorkspaceFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                create: {
                    args: Prisma.WorkspaceCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                createMany: {
                    args: Prisma.WorkspaceCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkspaceCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                delete: {
                    args: Prisma.WorkspaceDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                update: {
                    args: Prisma.WorkspaceUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                deleteMany: {
                    args: Prisma.WorkspaceDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkspaceUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkspaceUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>[];
                };
                upsert: {
                    args: Prisma.WorkspaceUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspacePayload>;
                };
                aggregate: {
                    args: Prisma.WorkspaceAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkspace>;
                };
                groupBy: {
                    args: Prisma.WorkspaceGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkspaceCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceCountAggregateOutputType> | number;
                };
            };
        };
        WorkspaceMember: {
            payload: Prisma.$WorkspaceMemberPayload<ExtArgs>;
            fields: Prisma.WorkspaceMemberFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkspaceMemberFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkspaceMemberFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                findFirst: {
                    args: Prisma.WorkspaceMemberFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkspaceMemberFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                findMany: {
                    args: Prisma.WorkspaceMemberFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[];
                };
                create: {
                    args: Prisma.WorkspaceMemberCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                createMany: {
                    args: Prisma.WorkspaceMemberCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkspaceMemberCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[];
                };
                delete: {
                    args: Prisma.WorkspaceMemberDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                update: {
                    args: Prisma.WorkspaceMemberUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                deleteMany: {
                    args: Prisma.WorkspaceMemberDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkspaceMemberUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkspaceMemberUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>[];
                };
                upsert: {
                    args: Prisma.WorkspaceMemberUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceMemberPayload>;
                };
                aggregate: {
                    args: Prisma.WorkspaceMemberAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkspaceMember>;
                };
                groupBy: {
                    args: Prisma.WorkspaceMemberGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceMemberGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkspaceMemberCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceMemberCountAggregateOutputType> | number;
                };
            };
        };
        WorkspaceInvite: {
            payload: Prisma.$WorkspaceInvitePayload<ExtArgs>;
            fields: Prisma.WorkspaceInviteFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkspaceInviteFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkspaceInviteFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                findFirst: {
                    args: Prisma.WorkspaceInviteFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkspaceInviteFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                findMany: {
                    args: Prisma.WorkspaceInviteFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>[];
                };
                create: {
                    args: Prisma.WorkspaceInviteCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                createMany: {
                    args: Prisma.WorkspaceInviteCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkspaceInviteCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>[];
                };
                delete: {
                    args: Prisma.WorkspaceInviteDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                update: {
                    args: Prisma.WorkspaceInviteUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                deleteMany: {
                    args: Prisma.WorkspaceInviteDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkspaceInviteUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkspaceInviteUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>[];
                };
                upsert: {
                    args: Prisma.WorkspaceInviteUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceInvitePayload>;
                };
                aggregate: {
                    args: Prisma.WorkspaceInviteAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkspaceInvite>;
                };
                groupBy: {
                    args: Prisma.WorkspaceInviteGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceInviteGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkspaceInviteCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceInviteCountAggregateOutputType> | number;
                };
            };
        };
        WorkspaceActivity: {
            payload: Prisma.$WorkspaceActivityPayload<ExtArgs>;
            fields: Prisma.WorkspaceActivityFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.WorkspaceActivityFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.WorkspaceActivityFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>;
                };
                findFirst: {
                    args: Prisma.WorkspaceActivityFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.WorkspaceActivityFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>;
                };
                findMany: {
                    args: Prisma.WorkspaceActivityFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>[];
                };
                create: {
                    args: Prisma.WorkspaceActivityCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>;
                };
                createMany: {
                    args: Prisma.WorkspaceActivityCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.WorkspaceActivityCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>[];
                };
                delete: {
                    args: Prisma.WorkspaceActivityDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>;
                };
                update: {
                    args: Prisma.WorkspaceActivityUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>;
                };
                deleteMany: {
                    args: Prisma.WorkspaceActivityDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.WorkspaceActivityUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.WorkspaceActivityUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>[];
                };
                upsert: {
                    args: Prisma.WorkspaceActivityUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$WorkspaceActivityPayload>;
                };
                aggregate: {
                    args: Prisma.WorkspaceActivityAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateWorkspaceActivity>;
                };
                groupBy: {
                    args: Prisma.WorkspaceActivityGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceActivityGroupByOutputType>[];
                };
                count: {
                    args: Prisma.WorkspaceActivityCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.WorkspaceActivityCountAggregateOutputType> | number;
                };
            };
        };
        Board: {
            payload: Prisma.$BoardPayload<ExtArgs>;
            fields: Prisma.BoardFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.BoardFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.BoardFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>;
                };
                findFirst: {
                    args: Prisma.BoardFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.BoardFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>;
                };
                findMany: {
                    args: Prisma.BoardFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>[];
                };
                create: {
                    args: Prisma.BoardCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>;
                };
                createMany: {
                    args: Prisma.BoardCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.BoardCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>[];
                };
                delete: {
                    args: Prisma.BoardDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>;
                };
                update: {
                    args: Prisma.BoardUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>;
                };
                deleteMany: {
                    args: Prisma.BoardDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.BoardUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.BoardUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>[];
                };
                upsert: {
                    args: Prisma.BoardUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$BoardPayload>;
                };
                aggregate: {
                    args: Prisma.BoardAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateBoard>;
                };
                groupBy: {
                    args: Prisma.BoardGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BoardGroupByOutputType>[];
                };
                count: {
                    args: Prisma.BoardCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.BoardCountAggregateOutputType> | number;
                };
            };
        };
        List: {
            payload: Prisma.$ListPayload<ExtArgs>;
            fields: Prisma.ListFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ListFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ListFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>;
                };
                findFirst: {
                    args: Prisma.ListFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ListFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>;
                };
                findMany: {
                    args: Prisma.ListFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>[];
                };
                create: {
                    args: Prisma.ListCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>;
                };
                createMany: {
                    args: Prisma.ListCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ListCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>[];
                };
                delete: {
                    args: Prisma.ListDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>;
                };
                update: {
                    args: Prisma.ListUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>;
                };
                deleteMany: {
                    args: Prisma.ListDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ListUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ListUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>[];
                };
                upsert: {
                    args: Prisma.ListUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ListPayload>;
                };
                aggregate: {
                    args: Prisma.ListAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateList>;
                };
                groupBy: {
                    args: Prisma.ListGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ListCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ListCountAggregateOutputType> | number;
                };
            };
        };
        Card: {
            payload: Prisma.$CardPayload<ExtArgs>;
            fields: Prisma.CardFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CardFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CardFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>;
                };
                findFirst: {
                    args: Prisma.CardFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CardFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>;
                };
                findMany: {
                    args: Prisma.CardFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>[];
                };
                create: {
                    args: Prisma.CardCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>;
                };
                createMany: {
                    args: Prisma.CardCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CardCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>[];
                };
                delete: {
                    args: Prisma.CardDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>;
                };
                update: {
                    args: Prisma.CardUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>;
                };
                deleteMany: {
                    args: Prisma.CardDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CardUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CardUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>[];
                };
                upsert: {
                    args: Prisma.CardUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CardPayload>;
                };
                aggregate: {
                    args: Prisma.CardAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCard>;
                };
                groupBy: {
                    args: Prisma.CardGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CardGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CardCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CardCountAggregateOutputType> | number;
                };
            };
        };
        Comment: {
            payload: Prisma.$CommentPayload<ExtArgs>;
            fields: Prisma.CommentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CommentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CommentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                findFirst: {
                    args: Prisma.CommentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CommentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                findMany: {
                    args: Prisma.CommentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                create: {
                    args: Prisma.CommentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                createMany: {
                    args: Prisma.CommentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CommentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                delete: {
                    args: Prisma.CommentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                update: {
                    args: Prisma.CommentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                deleteMany: {
                    args: Prisma.CommentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CommentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CommentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>[];
                };
                upsert: {
                    args: Prisma.CommentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CommentPayload>;
                };
                aggregate: {
                    args: Prisma.CommentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateComment>;
                };
                groupBy: {
                    args: Prisma.CommentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CommentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CommentCountAggregateOutputType> | number;
                };
            };
        };
        Character: {
            payload: Prisma.$CharacterPayload<ExtArgs>;
            fields: Prisma.CharacterFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CharacterFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CharacterFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>;
                };
                findFirst: {
                    args: Prisma.CharacterFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CharacterFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>;
                };
                findMany: {
                    args: Prisma.CharacterFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>[];
                };
                create: {
                    args: Prisma.CharacterCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>;
                };
                createMany: {
                    args: Prisma.CharacterCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CharacterCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>[];
                };
                delete: {
                    args: Prisma.CharacterDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>;
                };
                update: {
                    args: Prisma.CharacterUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>;
                };
                deleteMany: {
                    args: Prisma.CharacterDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CharacterUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CharacterUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>[];
                };
                upsert: {
                    args: Prisma.CharacterUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CharacterPayload>;
                };
                aggregate: {
                    args: Prisma.CharacterAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCharacter>;
                };
                groupBy: {
                    args: Prisma.CharacterGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CharacterGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CharacterCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CharacterCountAggregateOutputType> | number;
                };
            };
        };
        XpEvent: {
            payload: Prisma.$XpEventPayload<ExtArgs>;
            fields: Prisma.XpEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.XpEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.XpEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>;
                };
                findFirst: {
                    args: Prisma.XpEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.XpEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>;
                };
                findMany: {
                    args: Prisma.XpEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>[];
                };
                create: {
                    args: Prisma.XpEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>;
                };
                createMany: {
                    args: Prisma.XpEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.XpEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>[];
                };
                delete: {
                    args: Prisma.XpEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>;
                };
                update: {
                    args: Prisma.XpEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>;
                };
                deleteMany: {
                    args: Prisma.XpEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.XpEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.XpEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>[];
                };
                upsert: {
                    args: Prisma.XpEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$XpEventPayload>;
                };
                aggregate: {
                    args: Prisma.XpEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateXpEvent>;
                };
                groupBy: {
                    args: Prisma.XpEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.XpEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.XpEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.XpEventCountAggregateOutputType> | number;
                };
            };
        };
        HealthEvent: {
            payload: Prisma.$HealthEventPayload<ExtArgs>;
            fields: Prisma.HealthEventFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.HealthEventFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.HealthEventFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>;
                };
                findFirst: {
                    args: Prisma.HealthEventFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.HealthEventFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>;
                };
                findMany: {
                    args: Prisma.HealthEventFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>[];
                };
                create: {
                    args: Prisma.HealthEventCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>;
                };
                createMany: {
                    args: Prisma.HealthEventCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.HealthEventCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>[];
                };
                delete: {
                    args: Prisma.HealthEventDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>;
                };
                update: {
                    args: Prisma.HealthEventUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>;
                };
                deleteMany: {
                    args: Prisma.HealthEventDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.HealthEventUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.HealthEventUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>[];
                };
                upsert: {
                    args: Prisma.HealthEventUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$HealthEventPayload>;
                };
                aggregate: {
                    args: Prisma.HealthEventAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateHealthEvent>;
                };
                groupBy: {
                    args: Prisma.HealthEventGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HealthEventGroupByOutputType>[];
                };
                count: {
                    args: Prisma.HealthEventCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.HealthEventCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
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
    readonly JsonNull: runtime.JsonNullClass;
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
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
export type EnumAuthTokenTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthTokenType'>;
export type ListEnumAuthTokenTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AuthTokenType[]'>;
export type EnumWorkspaceRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceRole'>;
export type ListEnumWorkspaceRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceRole[]'>;
export type EnumWorkspaceInviteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceInviteStatus'>;
export type ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceInviteStatus[]'>;
export type EnumWorkspaceActivityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceActivityType'>;
export type ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'WorkspaceActivityType[]'>;
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
export type EnumListColorPresetFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListColorPreset'>;
export type ListEnumListColorPresetFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ListColorPreset[]'>;
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
export type EnumGenderCharacterFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GenderCharacter'>;
export type ListEnumGenderCharacterFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GenderCharacter[]'>;
export type EnumCharacterAvatarPresetFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CharacterAvatarPreset'>;
export type ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'CharacterAvatarPreset[]'>;
export type EnumXpEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'XpEventType'>;
export type ListEnumXpEventTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'XpEventType[]'>;
export type EnumHealthEventReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HealthEventReason'>;
export type ListEnumHealthEventReasonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'HealthEventReason[]'>;
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    accelerateUrl: string;
    adapter?: never;
}) & {
    errorFormat?: ErrorFormat;
    log?: (LogLevel | LogDefinition)[];
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
    omit?: GlobalOmitConfig;
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    user?: Prisma.UserOmit;
    authToken?: Prisma.AuthTokenOmit;
    workspace?: Prisma.WorkspaceOmit;
    workspaceMember?: Prisma.WorkspaceMemberOmit;
    workspaceInvite?: Prisma.WorkspaceInviteOmit;
    workspaceActivity?: Prisma.WorkspaceActivityOmit;
    board?: Prisma.BoardOmit;
    list?: Prisma.ListOmit;
    card?: Prisma.CardOmit;
    comment?: Prisma.CommentOmit;
    character?: Prisma.CharacterOmit;
    xpEvent?: Prisma.XpEventOmit;
    healthEvent?: Prisma.HealthEventOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
