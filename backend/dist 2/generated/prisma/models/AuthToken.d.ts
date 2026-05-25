import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type AuthTokenModel = runtime.Types.Result.DefaultSelection<Prisma.$AuthTokenPayload>;
export type AggregateAuthToken = {
    _count: AuthTokenCountAggregateOutputType | null;
    _avg: AuthTokenAvgAggregateOutputType | null;
    _sum: AuthTokenSumAggregateOutputType | null;
    _min: AuthTokenMinAggregateOutputType | null;
    _max: AuthTokenMaxAggregateOutputType | null;
};
export type AuthTokenAvgAggregateOutputType = {
    id: number | null;
    userId: number | null;
};
export type AuthTokenSumAggregateOutputType = {
    id: number | null;
    userId: number | null;
};
export type AuthTokenMinAggregateOutputType = {
    id: number | null;
    userId: number | null;
    type: $Enums.AuthTokenType | null;
    tokenHash: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
    usedAt: Date | null;
};
export type AuthTokenMaxAggregateOutputType = {
    id: number | null;
    userId: number | null;
    type: $Enums.AuthTokenType | null;
    tokenHash: string | null;
    expiresAt: Date | null;
    createdAt: Date | null;
    usedAt: Date | null;
};
export type AuthTokenCountAggregateOutputType = {
    id: number;
    userId: number;
    type: number;
    tokenHash: number;
    expiresAt: number;
    createdAt: number;
    usedAt: number;
    _all: number;
};
export type AuthTokenAvgAggregateInputType = {
    id?: true;
    userId?: true;
};
export type AuthTokenSumAggregateInputType = {
    id?: true;
    userId?: true;
};
export type AuthTokenMinAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    tokenHash?: true;
    expiresAt?: true;
    createdAt?: true;
    usedAt?: true;
};
export type AuthTokenMaxAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    tokenHash?: true;
    expiresAt?: true;
    createdAt?: true;
    usedAt?: true;
};
export type AuthTokenCountAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    tokenHash?: true;
    expiresAt?: true;
    createdAt?: true;
    usedAt?: true;
    _all?: true;
};
export type AuthTokenAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuthTokenWhereInput;
    orderBy?: Prisma.AuthTokenOrderByWithRelationInput | Prisma.AuthTokenOrderByWithRelationInput[];
    cursor?: Prisma.AuthTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AuthTokenCountAggregateInputType;
    _avg?: AuthTokenAvgAggregateInputType;
    _sum?: AuthTokenSumAggregateInputType;
    _min?: AuthTokenMinAggregateInputType;
    _max?: AuthTokenMaxAggregateInputType;
};
export type GetAuthTokenAggregateType<T extends AuthTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateAuthToken]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAuthToken[P]> : Prisma.GetScalarType<T[P], AggregateAuthToken[P]>;
};
export type AuthTokenGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuthTokenWhereInput;
    orderBy?: Prisma.AuthTokenOrderByWithAggregationInput | Prisma.AuthTokenOrderByWithAggregationInput[];
    by: Prisma.AuthTokenScalarFieldEnum[] | Prisma.AuthTokenScalarFieldEnum;
    having?: Prisma.AuthTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AuthTokenCountAggregateInputType | true;
    _avg?: AuthTokenAvgAggregateInputType;
    _sum?: AuthTokenSumAggregateInputType;
    _min?: AuthTokenMinAggregateInputType;
    _max?: AuthTokenMaxAggregateInputType;
};
export type AuthTokenGroupByOutputType = {
    id: number;
    userId: number;
    type: $Enums.AuthTokenType;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    usedAt: Date | null;
    _count: AuthTokenCountAggregateOutputType | null;
    _avg: AuthTokenAvgAggregateOutputType | null;
    _sum: AuthTokenSumAggregateOutputType | null;
    _min: AuthTokenMinAggregateOutputType | null;
    _max: AuthTokenMaxAggregateOutputType | null;
};
type GetAuthTokenGroupByPayload<T extends AuthTokenGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AuthTokenGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AuthTokenGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AuthTokenGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AuthTokenGroupByOutputType[P]>;
}>>;
export type AuthTokenWhereInput = {
    AND?: Prisma.AuthTokenWhereInput | Prisma.AuthTokenWhereInput[];
    OR?: Prisma.AuthTokenWhereInput[];
    NOT?: Prisma.AuthTokenWhereInput | Prisma.AuthTokenWhereInput[];
    id?: Prisma.IntFilter<"AuthToken"> | number;
    userId?: Prisma.IntFilter<"AuthToken"> | number;
    type?: Prisma.EnumAuthTokenTypeFilter<"AuthToken"> | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFilter<"AuthToken"> | string;
    expiresAt?: Prisma.DateTimeFilter<"AuthToken"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"AuthToken"> | Date | string;
    usedAt?: Prisma.DateTimeNullableFilter<"AuthToken"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type AuthTokenOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type AuthTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    tokenHash?: string;
    AND?: Prisma.AuthTokenWhereInput | Prisma.AuthTokenWhereInput[];
    OR?: Prisma.AuthTokenWhereInput[];
    NOT?: Prisma.AuthTokenWhereInput | Prisma.AuthTokenWhereInput[];
    userId?: Prisma.IntFilter<"AuthToken"> | number;
    type?: Prisma.EnumAuthTokenTypeFilter<"AuthToken"> | $Enums.AuthTokenType;
    expiresAt?: Prisma.DateTimeFilter<"AuthToken"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"AuthToken"> | Date | string;
    usedAt?: Prisma.DateTimeNullableFilter<"AuthToken"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "tokenHash">;
export type AuthTokenOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.AuthTokenCountOrderByAggregateInput;
    _avg?: Prisma.AuthTokenAvgOrderByAggregateInput;
    _max?: Prisma.AuthTokenMaxOrderByAggregateInput;
    _min?: Prisma.AuthTokenMinOrderByAggregateInput;
    _sum?: Prisma.AuthTokenSumOrderByAggregateInput;
};
export type AuthTokenScalarWhereWithAggregatesInput = {
    AND?: Prisma.AuthTokenScalarWhereWithAggregatesInput | Prisma.AuthTokenScalarWhereWithAggregatesInput[];
    OR?: Prisma.AuthTokenScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AuthTokenScalarWhereWithAggregatesInput | Prisma.AuthTokenScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"AuthToken"> | number;
    userId?: Prisma.IntWithAggregatesFilter<"AuthToken"> | number;
    type?: Prisma.EnumAuthTokenTypeWithAggregatesFilter<"AuthToken"> | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringWithAggregatesFilter<"AuthToken"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"AuthToken"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"AuthToken"> | Date | string;
    usedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"AuthToken"> | Date | string | null;
};
export type AuthTokenCreateInput = {
    type: $Enums.AuthTokenType;
    tokenHash: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    usedAt?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutAuthTokensInput;
};
export type AuthTokenUncheckedCreateInput = {
    id?: number;
    userId: number;
    type: $Enums.AuthTokenType;
    tokenHash: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    usedAt?: Date | string | null;
};
export type AuthTokenUpdateInput = {
    type?: Prisma.EnumAuthTokenTypeFieldUpdateOperationsInput | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutAuthTokensNestedInput;
};
export type AuthTokenUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumAuthTokenTypeFieldUpdateOperationsInput | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AuthTokenCreateManyInput = {
    id?: number;
    userId: number;
    type: $Enums.AuthTokenType;
    tokenHash: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    usedAt?: Date | string | null;
};
export type AuthTokenUpdateManyMutationInput = {
    type?: Prisma.EnumAuthTokenTypeFieldUpdateOperationsInput | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AuthTokenUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumAuthTokenTypeFieldUpdateOperationsInput | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AuthTokenListRelationFilter = {
    every?: Prisma.AuthTokenWhereInput;
    some?: Prisma.AuthTokenWhereInput;
    none?: Prisma.AuthTokenWhereInput;
};
export type AuthTokenOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type AuthTokenCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
};
export type AuthTokenAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type AuthTokenMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
};
export type AuthTokenMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    usedAt?: Prisma.SortOrder;
};
export type AuthTokenSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type AuthTokenCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AuthTokenCreateWithoutUserInput, Prisma.AuthTokenUncheckedCreateWithoutUserInput> | Prisma.AuthTokenCreateWithoutUserInput[] | Prisma.AuthTokenUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AuthTokenCreateOrConnectWithoutUserInput | Prisma.AuthTokenCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.AuthTokenCreateManyUserInputEnvelope;
    connect?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
};
export type AuthTokenUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.AuthTokenCreateWithoutUserInput, Prisma.AuthTokenUncheckedCreateWithoutUserInput> | Prisma.AuthTokenCreateWithoutUserInput[] | Prisma.AuthTokenUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AuthTokenCreateOrConnectWithoutUserInput | Prisma.AuthTokenCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.AuthTokenCreateManyUserInputEnvelope;
    connect?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
};
export type AuthTokenUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AuthTokenCreateWithoutUserInput, Prisma.AuthTokenUncheckedCreateWithoutUserInput> | Prisma.AuthTokenCreateWithoutUserInput[] | Prisma.AuthTokenUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AuthTokenCreateOrConnectWithoutUserInput | Prisma.AuthTokenCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.AuthTokenUpsertWithWhereUniqueWithoutUserInput | Prisma.AuthTokenUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.AuthTokenCreateManyUserInputEnvelope;
    set?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
    disconnect?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
    delete?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
    connect?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
    update?: Prisma.AuthTokenUpdateWithWhereUniqueWithoutUserInput | Prisma.AuthTokenUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.AuthTokenUpdateManyWithWhereWithoutUserInput | Prisma.AuthTokenUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.AuthTokenScalarWhereInput | Prisma.AuthTokenScalarWhereInput[];
};
export type AuthTokenUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.AuthTokenCreateWithoutUserInput, Prisma.AuthTokenUncheckedCreateWithoutUserInput> | Prisma.AuthTokenCreateWithoutUserInput[] | Prisma.AuthTokenUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.AuthTokenCreateOrConnectWithoutUserInput | Prisma.AuthTokenCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.AuthTokenUpsertWithWhereUniqueWithoutUserInput | Prisma.AuthTokenUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.AuthTokenCreateManyUserInputEnvelope;
    set?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
    disconnect?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
    delete?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
    connect?: Prisma.AuthTokenWhereUniqueInput | Prisma.AuthTokenWhereUniqueInput[];
    update?: Prisma.AuthTokenUpdateWithWhereUniqueWithoutUserInput | Prisma.AuthTokenUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.AuthTokenUpdateManyWithWhereWithoutUserInput | Prisma.AuthTokenUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.AuthTokenScalarWhereInput | Prisma.AuthTokenScalarWhereInput[];
};
export type EnumAuthTokenTypeFieldUpdateOperationsInput = {
    set?: $Enums.AuthTokenType;
};
export type AuthTokenCreateWithoutUserInput = {
    type: $Enums.AuthTokenType;
    tokenHash: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    usedAt?: Date | string | null;
};
export type AuthTokenUncheckedCreateWithoutUserInput = {
    id?: number;
    type: $Enums.AuthTokenType;
    tokenHash: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    usedAt?: Date | string | null;
};
export type AuthTokenCreateOrConnectWithoutUserInput = {
    where: Prisma.AuthTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.AuthTokenCreateWithoutUserInput, Prisma.AuthTokenUncheckedCreateWithoutUserInput>;
};
export type AuthTokenCreateManyUserInputEnvelope = {
    data: Prisma.AuthTokenCreateManyUserInput | Prisma.AuthTokenCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type AuthTokenUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.AuthTokenWhereUniqueInput;
    update: Prisma.XOR<Prisma.AuthTokenUpdateWithoutUserInput, Prisma.AuthTokenUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.AuthTokenCreateWithoutUserInput, Prisma.AuthTokenUncheckedCreateWithoutUserInput>;
};
export type AuthTokenUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.AuthTokenWhereUniqueInput;
    data: Prisma.XOR<Prisma.AuthTokenUpdateWithoutUserInput, Prisma.AuthTokenUncheckedUpdateWithoutUserInput>;
};
export type AuthTokenUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.AuthTokenScalarWhereInput;
    data: Prisma.XOR<Prisma.AuthTokenUpdateManyMutationInput, Prisma.AuthTokenUncheckedUpdateManyWithoutUserInput>;
};
export type AuthTokenScalarWhereInput = {
    AND?: Prisma.AuthTokenScalarWhereInput | Prisma.AuthTokenScalarWhereInput[];
    OR?: Prisma.AuthTokenScalarWhereInput[];
    NOT?: Prisma.AuthTokenScalarWhereInput | Prisma.AuthTokenScalarWhereInput[];
    id?: Prisma.IntFilter<"AuthToken"> | number;
    userId?: Prisma.IntFilter<"AuthToken"> | number;
    type?: Prisma.EnumAuthTokenTypeFilter<"AuthToken"> | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFilter<"AuthToken"> | string;
    expiresAt?: Prisma.DateTimeFilter<"AuthToken"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"AuthToken"> | Date | string;
    usedAt?: Prisma.DateTimeNullableFilter<"AuthToken"> | Date | string | null;
};
export type AuthTokenCreateManyUserInput = {
    id?: number;
    type: $Enums.AuthTokenType;
    tokenHash: string;
    expiresAt: Date | string;
    createdAt?: Date | string;
    usedAt?: Date | string | null;
};
export type AuthTokenUpdateWithoutUserInput = {
    type?: Prisma.EnumAuthTokenTypeFieldUpdateOperationsInput | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AuthTokenUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumAuthTokenTypeFieldUpdateOperationsInput | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AuthTokenUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumAuthTokenTypeFieldUpdateOperationsInput | $Enums.AuthTokenType;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    usedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type AuthTokenSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    usedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["authToken"]>;
export type AuthTokenSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    usedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["authToken"]>;
export type AuthTokenSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    usedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["authToken"]>;
export type AuthTokenSelectScalar = {
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    tokenHash?: boolean;
    expiresAt?: boolean;
    createdAt?: boolean;
    usedAt?: boolean;
};
export type AuthTokenOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "type" | "tokenHash" | "expiresAt" | "createdAt" | "usedAt", ExtArgs["result"]["authToken"]>;
export type AuthTokenInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AuthTokenIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type AuthTokenIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $AuthTokenPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AuthToken";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        userId: number;
        type: $Enums.AuthTokenType;
        tokenHash: string;
        expiresAt: Date;
        createdAt: Date;
        usedAt: Date | null;
    }, ExtArgs["result"]["authToken"]>;
    composites: {};
};
export type AuthTokenGetPayload<S extends boolean | null | undefined | AuthTokenDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload, S>;
export type AuthTokenCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AuthTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AuthTokenCountAggregateInputType | true;
};
export interface AuthTokenDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AuthToken'];
        meta: {
            name: 'AuthToken';
        };
    };
    findUnique<T extends AuthTokenFindUniqueArgs>(args: Prisma.SelectSubset<T, AuthTokenFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AuthTokenClient<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AuthTokenFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AuthTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AuthTokenClient<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AuthTokenFindFirstArgs>(args?: Prisma.SelectSubset<T, AuthTokenFindFirstArgs<ExtArgs>>): Prisma.Prisma__AuthTokenClient<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AuthTokenFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AuthTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AuthTokenClient<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AuthTokenFindManyArgs>(args?: Prisma.SelectSubset<T, AuthTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AuthTokenCreateArgs>(args: Prisma.SelectSubset<T, AuthTokenCreateArgs<ExtArgs>>): Prisma.Prisma__AuthTokenClient<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AuthTokenCreateManyArgs>(args?: Prisma.SelectSubset<T, AuthTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AuthTokenCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AuthTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AuthTokenDeleteArgs>(args: Prisma.SelectSubset<T, AuthTokenDeleteArgs<ExtArgs>>): Prisma.Prisma__AuthTokenClient<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AuthTokenUpdateArgs>(args: Prisma.SelectSubset<T, AuthTokenUpdateArgs<ExtArgs>>): Prisma.Prisma__AuthTokenClient<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AuthTokenDeleteManyArgs>(args?: Prisma.SelectSubset<T, AuthTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AuthTokenUpdateManyArgs>(args: Prisma.SelectSubset<T, AuthTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AuthTokenUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AuthTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AuthTokenUpsertArgs>(args: Prisma.SelectSubset<T, AuthTokenUpsertArgs<ExtArgs>>): Prisma.Prisma__AuthTokenClient<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AuthTokenCountArgs>(args?: Prisma.Subset<T, AuthTokenCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AuthTokenCountAggregateOutputType> : number>;
    aggregate<T extends AuthTokenAggregateArgs>(args: Prisma.Subset<T, AuthTokenAggregateArgs>): Prisma.PrismaPromise<GetAuthTokenAggregateType<T>>;
    groupBy<T extends AuthTokenGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AuthTokenGroupByArgs['orderBy'];
    } : {
        orderBy?: AuthTokenGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AuthTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAuthTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AuthTokenFieldRefs;
}
export interface Prisma__AuthTokenClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AuthTokenFieldRefs {
    readonly id: Prisma.FieldRef<"AuthToken", 'Int'>;
    readonly userId: Prisma.FieldRef<"AuthToken", 'Int'>;
    readonly type: Prisma.FieldRef<"AuthToken", 'AuthTokenType'>;
    readonly tokenHash: Prisma.FieldRef<"AuthToken", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"AuthToken", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"AuthToken", 'DateTime'>;
    readonly usedAt: Prisma.FieldRef<"AuthToken", 'DateTime'>;
}
export type AuthTokenFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    where: Prisma.AuthTokenWhereUniqueInput;
};
export type AuthTokenFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    where: Prisma.AuthTokenWhereUniqueInput;
};
export type AuthTokenFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    where?: Prisma.AuthTokenWhereInput;
    orderBy?: Prisma.AuthTokenOrderByWithRelationInput | Prisma.AuthTokenOrderByWithRelationInput[];
    cursor?: Prisma.AuthTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuthTokenScalarFieldEnum | Prisma.AuthTokenScalarFieldEnum[];
};
export type AuthTokenFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    where?: Prisma.AuthTokenWhereInput;
    orderBy?: Prisma.AuthTokenOrderByWithRelationInput | Prisma.AuthTokenOrderByWithRelationInput[];
    cursor?: Prisma.AuthTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuthTokenScalarFieldEnum | Prisma.AuthTokenScalarFieldEnum[];
};
export type AuthTokenFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    where?: Prisma.AuthTokenWhereInput;
    orderBy?: Prisma.AuthTokenOrderByWithRelationInput | Prisma.AuthTokenOrderByWithRelationInput[];
    cursor?: Prisma.AuthTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AuthTokenScalarFieldEnum | Prisma.AuthTokenScalarFieldEnum[];
};
export type AuthTokenCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AuthTokenCreateInput, Prisma.AuthTokenUncheckedCreateInput>;
};
export type AuthTokenCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AuthTokenCreateManyInput | Prisma.AuthTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AuthTokenCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    data: Prisma.AuthTokenCreateManyInput | Prisma.AuthTokenCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.AuthTokenIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type AuthTokenUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AuthTokenUpdateInput, Prisma.AuthTokenUncheckedUpdateInput>;
    where: Prisma.AuthTokenWhereUniqueInput;
};
export type AuthTokenUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AuthTokenUpdateManyMutationInput, Prisma.AuthTokenUncheckedUpdateManyInput>;
    where?: Prisma.AuthTokenWhereInput;
    limit?: number;
};
export type AuthTokenUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AuthTokenUpdateManyMutationInput, Prisma.AuthTokenUncheckedUpdateManyInput>;
    where?: Prisma.AuthTokenWhereInput;
    limit?: number;
    include?: Prisma.AuthTokenIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type AuthTokenUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    where: Prisma.AuthTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.AuthTokenCreateInput, Prisma.AuthTokenUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AuthTokenUpdateInput, Prisma.AuthTokenUncheckedUpdateInput>;
};
export type AuthTokenDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
    where: Prisma.AuthTokenWhereUniqueInput;
};
export type AuthTokenDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuthTokenWhereInput;
    limit?: number;
};
export type AuthTokenDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AuthTokenSelect<ExtArgs> | null;
    omit?: Prisma.AuthTokenOmit<ExtArgs> | null;
    include?: Prisma.AuthTokenInclude<ExtArgs> | null;
};
export {};
