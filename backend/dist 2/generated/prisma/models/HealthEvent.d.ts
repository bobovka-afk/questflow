import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type HealthEventModel = runtime.Types.Result.DefaultSelection<Prisma.$HealthEventPayload>;
export type AggregateHealthEvent = {
    _count: HealthEventCountAggregateOutputType | null;
    _avg: HealthEventAvgAggregateOutputType | null;
    _sum: HealthEventSumAggregateOutputType | null;
    _min: HealthEventMinAggregateOutputType | null;
    _max: HealthEventMaxAggregateOutputType | null;
};
export type HealthEventAvgAggregateOutputType = {
    id: number | null;
    userId: number | null;
    delta: number | null;
};
export type HealthEventSumAggregateOutputType = {
    id: number | null;
    userId: number | null;
    delta: number | null;
};
export type HealthEventMinAggregateOutputType = {
    id: number | null;
    userId: number | null;
    dayKey: Date | null;
    delta: number | null;
    reason: $Enums.HealthEventReason | null;
    createdAt: Date | null;
};
export type HealthEventMaxAggregateOutputType = {
    id: number | null;
    userId: number | null;
    dayKey: Date | null;
    delta: number | null;
    reason: $Enums.HealthEventReason | null;
    createdAt: Date | null;
};
export type HealthEventCountAggregateOutputType = {
    id: number;
    userId: number;
    dayKey: number;
    delta: number;
    reason: number;
    createdAt: number;
    _all: number;
};
export type HealthEventAvgAggregateInputType = {
    id?: true;
    userId?: true;
    delta?: true;
};
export type HealthEventSumAggregateInputType = {
    id?: true;
    userId?: true;
    delta?: true;
};
export type HealthEventMinAggregateInputType = {
    id?: true;
    userId?: true;
    dayKey?: true;
    delta?: true;
    reason?: true;
    createdAt?: true;
};
export type HealthEventMaxAggregateInputType = {
    id?: true;
    userId?: true;
    dayKey?: true;
    delta?: true;
    reason?: true;
    createdAt?: true;
};
export type HealthEventCountAggregateInputType = {
    id?: true;
    userId?: true;
    dayKey?: true;
    delta?: true;
    reason?: true;
    createdAt?: true;
    _all?: true;
};
export type HealthEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HealthEventWhereInput;
    orderBy?: Prisma.HealthEventOrderByWithRelationInput | Prisma.HealthEventOrderByWithRelationInput[];
    cursor?: Prisma.HealthEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | HealthEventCountAggregateInputType;
    _avg?: HealthEventAvgAggregateInputType;
    _sum?: HealthEventSumAggregateInputType;
    _min?: HealthEventMinAggregateInputType;
    _max?: HealthEventMaxAggregateInputType;
};
export type GetHealthEventAggregateType<T extends HealthEventAggregateArgs> = {
    [P in keyof T & keyof AggregateHealthEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateHealthEvent[P]> : Prisma.GetScalarType<T[P], AggregateHealthEvent[P]>;
};
export type HealthEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HealthEventWhereInput;
    orderBy?: Prisma.HealthEventOrderByWithAggregationInput | Prisma.HealthEventOrderByWithAggregationInput[];
    by: Prisma.HealthEventScalarFieldEnum[] | Prisma.HealthEventScalarFieldEnum;
    having?: Prisma.HealthEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: HealthEventCountAggregateInputType | true;
    _avg?: HealthEventAvgAggregateInputType;
    _sum?: HealthEventSumAggregateInputType;
    _min?: HealthEventMinAggregateInputType;
    _max?: HealthEventMaxAggregateInputType;
};
export type HealthEventGroupByOutputType = {
    id: number;
    userId: number;
    dayKey: Date;
    delta: number;
    reason: $Enums.HealthEventReason;
    createdAt: Date;
    _count: HealthEventCountAggregateOutputType | null;
    _avg: HealthEventAvgAggregateOutputType | null;
    _sum: HealthEventSumAggregateOutputType | null;
    _min: HealthEventMinAggregateOutputType | null;
    _max: HealthEventMaxAggregateOutputType | null;
};
type GetHealthEventGroupByPayload<T extends HealthEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<HealthEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof HealthEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], HealthEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], HealthEventGroupByOutputType[P]>;
}>>;
export type HealthEventWhereInput = {
    AND?: Prisma.HealthEventWhereInput | Prisma.HealthEventWhereInput[];
    OR?: Prisma.HealthEventWhereInput[];
    NOT?: Prisma.HealthEventWhereInput | Prisma.HealthEventWhereInput[];
    id?: Prisma.IntFilter<"HealthEvent"> | number;
    userId?: Prisma.IntFilter<"HealthEvent"> | number;
    dayKey?: Prisma.DateTimeFilter<"HealthEvent"> | Date | string;
    delta?: Prisma.IntFilter<"HealthEvent"> | number;
    reason?: Prisma.EnumHealthEventReasonFilter<"HealthEvent"> | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFilter<"HealthEvent"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type HealthEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    dayKey?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type HealthEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    userId_dayKey_reason?: Prisma.HealthEventUserIdDayKeyReasonCompoundUniqueInput;
    AND?: Prisma.HealthEventWhereInput | Prisma.HealthEventWhereInput[];
    OR?: Prisma.HealthEventWhereInput[];
    NOT?: Prisma.HealthEventWhereInput | Prisma.HealthEventWhereInput[];
    userId?: Prisma.IntFilter<"HealthEvent"> | number;
    dayKey?: Prisma.DateTimeFilter<"HealthEvent"> | Date | string;
    delta?: Prisma.IntFilter<"HealthEvent"> | number;
    reason?: Prisma.EnumHealthEventReasonFilter<"HealthEvent"> | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFilter<"HealthEvent"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "userId_dayKey_reason">;
export type HealthEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    dayKey?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.HealthEventCountOrderByAggregateInput;
    _avg?: Prisma.HealthEventAvgOrderByAggregateInput;
    _max?: Prisma.HealthEventMaxOrderByAggregateInput;
    _min?: Prisma.HealthEventMinOrderByAggregateInput;
    _sum?: Prisma.HealthEventSumOrderByAggregateInput;
};
export type HealthEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.HealthEventScalarWhereWithAggregatesInput | Prisma.HealthEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.HealthEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.HealthEventScalarWhereWithAggregatesInput | Prisma.HealthEventScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"HealthEvent"> | number;
    userId?: Prisma.IntWithAggregatesFilter<"HealthEvent"> | number;
    dayKey?: Prisma.DateTimeWithAggregatesFilter<"HealthEvent"> | Date | string;
    delta?: Prisma.IntWithAggregatesFilter<"HealthEvent"> | number;
    reason?: Prisma.EnumHealthEventReasonWithAggregatesFilter<"HealthEvent"> | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"HealthEvent"> | Date | string;
};
export type HealthEventCreateInput = {
    dayKey: Date | string;
    delta: number;
    reason: $Enums.HealthEventReason;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutHealthEventsInput;
};
export type HealthEventUncheckedCreateInput = {
    id?: number;
    userId: number;
    dayKey: Date | string;
    delta: number;
    reason: $Enums.HealthEventReason;
    createdAt?: Date | string;
};
export type HealthEventUpdateInput = {
    dayKey?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.EnumHealthEventReasonFieldUpdateOperationsInput | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutHealthEventsNestedInput;
};
export type HealthEventUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    dayKey?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.EnumHealthEventReasonFieldUpdateOperationsInput | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthEventCreateManyInput = {
    id?: number;
    userId: number;
    dayKey: Date | string;
    delta: number;
    reason: $Enums.HealthEventReason;
    createdAt?: Date | string;
};
export type HealthEventUpdateManyMutationInput = {
    dayKey?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.EnumHealthEventReasonFieldUpdateOperationsInput | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthEventUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    dayKey?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.EnumHealthEventReasonFieldUpdateOperationsInput | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthEventListRelationFilter = {
    every?: Prisma.HealthEventWhereInput;
    some?: Prisma.HealthEventWhereInput;
    none?: Prisma.HealthEventWhereInput;
};
export type HealthEventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type HealthEventUserIdDayKeyReasonCompoundUniqueInput = {
    userId: number;
    dayKey: Date | string;
    reason: $Enums.HealthEventReason;
};
export type HealthEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    dayKey?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HealthEventAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
};
export type HealthEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    dayKey?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HealthEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    dayKey?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type HealthEventSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    delta?: Prisma.SortOrder;
};
export type HealthEventCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.HealthEventCreateWithoutUserInput, Prisma.HealthEventUncheckedCreateWithoutUserInput> | Prisma.HealthEventCreateWithoutUserInput[] | Prisma.HealthEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.HealthEventCreateOrConnectWithoutUserInput | Prisma.HealthEventCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.HealthEventCreateManyUserInputEnvelope;
    connect?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
};
export type HealthEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.HealthEventCreateWithoutUserInput, Prisma.HealthEventUncheckedCreateWithoutUserInput> | Prisma.HealthEventCreateWithoutUserInput[] | Prisma.HealthEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.HealthEventCreateOrConnectWithoutUserInput | Prisma.HealthEventCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.HealthEventCreateManyUserInputEnvelope;
    connect?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
};
export type HealthEventUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.HealthEventCreateWithoutUserInput, Prisma.HealthEventUncheckedCreateWithoutUserInput> | Prisma.HealthEventCreateWithoutUserInput[] | Prisma.HealthEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.HealthEventCreateOrConnectWithoutUserInput | Prisma.HealthEventCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.HealthEventUpsertWithWhereUniqueWithoutUserInput | Prisma.HealthEventUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.HealthEventCreateManyUserInputEnvelope;
    set?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
    disconnect?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
    delete?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
    connect?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
    update?: Prisma.HealthEventUpdateWithWhereUniqueWithoutUserInput | Prisma.HealthEventUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.HealthEventUpdateManyWithWhereWithoutUserInput | Prisma.HealthEventUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.HealthEventScalarWhereInput | Prisma.HealthEventScalarWhereInput[];
};
export type HealthEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.HealthEventCreateWithoutUserInput, Prisma.HealthEventUncheckedCreateWithoutUserInput> | Prisma.HealthEventCreateWithoutUserInput[] | Prisma.HealthEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.HealthEventCreateOrConnectWithoutUserInput | Prisma.HealthEventCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.HealthEventUpsertWithWhereUniqueWithoutUserInput | Prisma.HealthEventUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.HealthEventCreateManyUserInputEnvelope;
    set?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
    disconnect?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
    delete?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
    connect?: Prisma.HealthEventWhereUniqueInput | Prisma.HealthEventWhereUniqueInput[];
    update?: Prisma.HealthEventUpdateWithWhereUniqueWithoutUserInput | Prisma.HealthEventUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.HealthEventUpdateManyWithWhereWithoutUserInput | Prisma.HealthEventUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.HealthEventScalarWhereInput | Prisma.HealthEventScalarWhereInput[];
};
export type EnumHealthEventReasonFieldUpdateOperationsInput = {
    set?: $Enums.HealthEventReason;
};
export type HealthEventCreateWithoutUserInput = {
    dayKey: Date | string;
    delta: number;
    reason: $Enums.HealthEventReason;
    createdAt?: Date | string;
};
export type HealthEventUncheckedCreateWithoutUserInput = {
    id?: number;
    dayKey: Date | string;
    delta: number;
    reason: $Enums.HealthEventReason;
    createdAt?: Date | string;
};
export type HealthEventCreateOrConnectWithoutUserInput = {
    where: Prisma.HealthEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.HealthEventCreateWithoutUserInput, Prisma.HealthEventUncheckedCreateWithoutUserInput>;
};
export type HealthEventCreateManyUserInputEnvelope = {
    data: Prisma.HealthEventCreateManyUserInput | Prisma.HealthEventCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type HealthEventUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.HealthEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.HealthEventUpdateWithoutUserInput, Prisma.HealthEventUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.HealthEventCreateWithoutUserInput, Prisma.HealthEventUncheckedCreateWithoutUserInput>;
};
export type HealthEventUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.HealthEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.HealthEventUpdateWithoutUserInput, Prisma.HealthEventUncheckedUpdateWithoutUserInput>;
};
export type HealthEventUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.HealthEventScalarWhereInput;
    data: Prisma.XOR<Prisma.HealthEventUpdateManyMutationInput, Prisma.HealthEventUncheckedUpdateManyWithoutUserInput>;
};
export type HealthEventScalarWhereInput = {
    AND?: Prisma.HealthEventScalarWhereInput | Prisma.HealthEventScalarWhereInput[];
    OR?: Prisma.HealthEventScalarWhereInput[];
    NOT?: Prisma.HealthEventScalarWhereInput | Prisma.HealthEventScalarWhereInput[];
    id?: Prisma.IntFilter<"HealthEvent"> | number;
    userId?: Prisma.IntFilter<"HealthEvent"> | number;
    dayKey?: Prisma.DateTimeFilter<"HealthEvent"> | Date | string;
    delta?: Prisma.IntFilter<"HealthEvent"> | number;
    reason?: Prisma.EnumHealthEventReasonFilter<"HealthEvent"> | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFilter<"HealthEvent"> | Date | string;
};
export type HealthEventCreateManyUserInput = {
    id?: number;
    dayKey: Date | string;
    delta: number;
    reason: $Enums.HealthEventReason;
    createdAt?: Date | string;
};
export type HealthEventUpdateWithoutUserInput = {
    dayKey?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.EnumHealthEventReasonFieldUpdateOperationsInput | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthEventUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    dayKey?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.EnumHealthEventReasonFieldUpdateOperationsInput | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthEventUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    dayKey?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    delta?: Prisma.IntFieldUpdateOperationsInput | number;
    reason?: Prisma.EnumHealthEventReasonFieldUpdateOperationsInput | $Enums.HealthEventReason;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type HealthEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    dayKey?: boolean;
    delta?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["healthEvent"]>;
export type HealthEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    dayKey?: boolean;
    delta?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["healthEvent"]>;
export type HealthEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    dayKey?: boolean;
    delta?: boolean;
    reason?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["healthEvent"]>;
export type HealthEventSelectScalar = {
    id?: boolean;
    userId?: boolean;
    dayKey?: boolean;
    delta?: boolean;
    reason?: boolean;
    createdAt?: boolean;
};
export type HealthEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "dayKey" | "delta" | "reason" | "createdAt", ExtArgs["result"]["healthEvent"]>;
export type HealthEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type HealthEventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type HealthEventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $HealthEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "HealthEvent";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        userId: number;
        dayKey: Date;
        delta: number;
        reason: $Enums.HealthEventReason;
        createdAt: Date;
    }, ExtArgs["result"]["healthEvent"]>;
    composites: {};
};
export type HealthEventGetPayload<S extends boolean | null | undefined | HealthEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$HealthEventPayload, S>;
export type HealthEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<HealthEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: HealthEventCountAggregateInputType | true;
};
export interface HealthEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['HealthEvent'];
        meta: {
            name: 'HealthEvent';
        };
    };
    findUnique<T extends HealthEventFindUniqueArgs>(args: Prisma.SelectSubset<T, HealthEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__HealthEventClient<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends HealthEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, HealthEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__HealthEventClient<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends HealthEventFindFirstArgs>(args?: Prisma.SelectSubset<T, HealthEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__HealthEventClient<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends HealthEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, HealthEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__HealthEventClient<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends HealthEventFindManyArgs>(args?: Prisma.SelectSubset<T, HealthEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends HealthEventCreateArgs>(args: Prisma.SelectSubset<T, HealthEventCreateArgs<ExtArgs>>): Prisma.Prisma__HealthEventClient<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends HealthEventCreateManyArgs>(args?: Prisma.SelectSubset<T, HealthEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends HealthEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, HealthEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends HealthEventDeleteArgs>(args: Prisma.SelectSubset<T, HealthEventDeleteArgs<ExtArgs>>): Prisma.Prisma__HealthEventClient<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends HealthEventUpdateArgs>(args: Prisma.SelectSubset<T, HealthEventUpdateArgs<ExtArgs>>): Prisma.Prisma__HealthEventClient<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends HealthEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, HealthEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends HealthEventUpdateManyArgs>(args: Prisma.SelectSubset<T, HealthEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends HealthEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, HealthEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends HealthEventUpsertArgs>(args: Prisma.SelectSubset<T, HealthEventUpsertArgs<ExtArgs>>): Prisma.Prisma__HealthEventClient<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends HealthEventCountArgs>(args?: Prisma.Subset<T, HealthEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], HealthEventCountAggregateOutputType> : number>;
    aggregate<T extends HealthEventAggregateArgs>(args: Prisma.Subset<T, HealthEventAggregateArgs>): Prisma.PrismaPromise<GetHealthEventAggregateType<T>>;
    groupBy<T extends HealthEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: HealthEventGroupByArgs['orderBy'];
    } : {
        orderBy?: HealthEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, HealthEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetHealthEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: HealthEventFieldRefs;
}
export interface Prisma__HealthEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface HealthEventFieldRefs {
    readonly id: Prisma.FieldRef<"HealthEvent", 'Int'>;
    readonly userId: Prisma.FieldRef<"HealthEvent", 'Int'>;
    readonly dayKey: Prisma.FieldRef<"HealthEvent", 'DateTime'>;
    readonly delta: Prisma.FieldRef<"HealthEvent", 'Int'>;
    readonly reason: Prisma.FieldRef<"HealthEvent", 'HealthEventReason'>;
    readonly createdAt: Prisma.FieldRef<"HealthEvent", 'DateTime'>;
}
export type HealthEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    where: Prisma.HealthEventWhereUniqueInput;
};
export type HealthEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    where: Prisma.HealthEventWhereUniqueInput;
};
export type HealthEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    where?: Prisma.HealthEventWhereInput;
    orderBy?: Prisma.HealthEventOrderByWithRelationInput | Prisma.HealthEventOrderByWithRelationInput[];
    cursor?: Prisma.HealthEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HealthEventScalarFieldEnum | Prisma.HealthEventScalarFieldEnum[];
};
export type HealthEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    where?: Prisma.HealthEventWhereInput;
    orderBy?: Prisma.HealthEventOrderByWithRelationInput | Prisma.HealthEventOrderByWithRelationInput[];
    cursor?: Prisma.HealthEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HealthEventScalarFieldEnum | Prisma.HealthEventScalarFieldEnum[];
};
export type HealthEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    where?: Prisma.HealthEventWhereInput;
    orderBy?: Prisma.HealthEventOrderByWithRelationInput | Prisma.HealthEventOrderByWithRelationInput[];
    cursor?: Prisma.HealthEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.HealthEventScalarFieldEnum | Prisma.HealthEventScalarFieldEnum[];
};
export type HealthEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HealthEventCreateInput, Prisma.HealthEventUncheckedCreateInput>;
};
export type HealthEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.HealthEventCreateManyInput | Prisma.HealthEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type HealthEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    data: Prisma.HealthEventCreateManyInput | Prisma.HealthEventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.HealthEventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type HealthEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HealthEventUpdateInput, Prisma.HealthEventUncheckedUpdateInput>;
    where: Prisma.HealthEventWhereUniqueInput;
};
export type HealthEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.HealthEventUpdateManyMutationInput, Prisma.HealthEventUncheckedUpdateManyInput>;
    where?: Prisma.HealthEventWhereInput;
    limit?: number;
};
export type HealthEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.HealthEventUpdateManyMutationInput, Prisma.HealthEventUncheckedUpdateManyInput>;
    where?: Prisma.HealthEventWhereInput;
    limit?: number;
    include?: Prisma.HealthEventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type HealthEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    where: Prisma.HealthEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.HealthEventCreateInput, Prisma.HealthEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.HealthEventUpdateInput, Prisma.HealthEventUncheckedUpdateInput>;
};
export type HealthEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
    where: Prisma.HealthEventWhereUniqueInput;
};
export type HealthEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HealthEventWhereInput;
    limit?: number;
};
export type HealthEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.HealthEventSelect<ExtArgs> | null;
    omit?: Prisma.HealthEventOmit<ExtArgs> | null;
    include?: Prisma.HealthEventInclude<ExtArgs> | null;
};
export {};
