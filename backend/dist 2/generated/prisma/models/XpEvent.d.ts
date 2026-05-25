import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type XpEventModel = runtime.Types.Result.DefaultSelection<Prisma.$XpEventPayload>;
export type AggregateXpEvent = {
    _count: XpEventCountAggregateOutputType | null;
    _avg: XpEventAvgAggregateOutputType | null;
    _sum: XpEventSumAggregateOutputType | null;
    _min: XpEventMinAggregateOutputType | null;
    _max: XpEventMaxAggregateOutputType | null;
};
export type XpEventAvgAggregateOutputType = {
    id: number | null;
    userId: number | null;
    cardId: number | null;
    xpAmount: number | null;
};
export type XpEventSumAggregateOutputType = {
    id: number | null;
    userId: number | null;
    cardId: number | null;
    xpAmount: number | null;
};
export type XpEventMinAggregateOutputType = {
    id: number | null;
    userId: number | null;
    type: $Enums.XpEventType | null;
    cardId: number | null;
    dayKey: Date | null;
    xpAmount: number | null;
    createdAt: Date | null;
};
export type XpEventMaxAggregateOutputType = {
    id: number | null;
    userId: number | null;
    type: $Enums.XpEventType | null;
    cardId: number | null;
    dayKey: Date | null;
    xpAmount: number | null;
    createdAt: Date | null;
};
export type XpEventCountAggregateOutputType = {
    id: number;
    userId: number;
    type: number;
    cardId: number;
    dayKey: number;
    xpAmount: number;
    createdAt: number;
    _all: number;
};
export type XpEventAvgAggregateInputType = {
    id?: true;
    userId?: true;
    cardId?: true;
    xpAmount?: true;
};
export type XpEventSumAggregateInputType = {
    id?: true;
    userId?: true;
    cardId?: true;
    xpAmount?: true;
};
export type XpEventMinAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    cardId?: true;
    dayKey?: true;
    xpAmount?: true;
    createdAt?: true;
};
export type XpEventMaxAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    cardId?: true;
    dayKey?: true;
    xpAmount?: true;
    createdAt?: true;
};
export type XpEventCountAggregateInputType = {
    id?: true;
    userId?: true;
    type?: true;
    cardId?: true;
    dayKey?: true;
    xpAmount?: true;
    createdAt?: true;
    _all?: true;
};
export type XpEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.XpEventWhereInput;
    orderBy?: Prisma.XpEventOrderByWithRelationInput | Prisma.XpEventOrderByWithRelationInput[];
    cursor?: Prisma.XpEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | XpEventCountAggregateInputType;
    _avg?: XpEventAvgAggregateInputType;
    _sum?: XpEventSumAggregateInputType;
    _min?: XpEventMinAggregateInputType;
    _max?: XpEventMaxAggregateInputType;
};
export type GetXpEventAggregateType<T extends XpEventAggregateArgs> = {
    [P in keyof T & keyof AggregateXpEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateXpEvent[P]> : Prisma.GetScalarType<T[P], AggregateXpEvent[P]>;
};
export type XpEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.XpEventWhereInput;
    orderBy?: Prisma.XpEventOrderByWithAggregationInput | Prisma.XpEventOrderByWithAggregationInput[];
    by: Prisma.XpEventScalarFieldEnum[] | Prisma.XpEventScalarFieldEnum;
    having?: Prisma.XpEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: XpEventCountAggregateInputType | true;
    _avg?: XpEventAvgAggregateInputType;
    _sum?: XpEventSumAggregateInputType;
    _min?: XpEventMinAggregateInputType;
    _max?: XpEventMaxAggregateInputType;
};
export type XpEventGroupByOutputType = {
    id: number;
    userId: number;
    type: $Enums.XpEventType;
    cardId: number | null;
    dayKey: Date | null;
    xpAmount: number;
    createdAt: Date;
    _count: XpEventCountAggregateOutputType | null;
    _avg: XpEventAvgAggregateOutputType | null;
    _sum: XpEventSumAggregateOutputType | null;
    _min: XpEventMinAggregateOutputType | null;
    _max: XpEventMaxAggregateOutputType | null;
};
type GetXpEventGroupByPayload<T extends XpEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<XpEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof XpEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], XpEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], XpEventGroupByOutputType[P]>;
}>>;
export type XpEventWhereInput = {
    AND?: Prisma.XpEventWhereInput | Prisma.XpEventWhereInput[];
    OR?: Prisma.XpEventWhereInput[];
    NOT?: Prisma.XpEventWhereInput | Prisma.XpEventWhereInput[];
    id?: Prisma.IntFilter<"XpEvent"> | number;
    userId?: Prisma.IntFilter<"XpEvent"> | number;
    type?: Prisma.EnumXpEventTypeFilter<"XpEvent"> | $Enums.XpEventType;
    cardId?: Prisma.IntNullableFilter<"XpEvent"> | number | null;
    dayKey?: Prisma.DateTimeNullableFilter<"XpEvent"> | Date | string | null;
    xpAmount?: Prisma.IntFilter<"XpEvent"> | number;
    createdAt?: Prisma.DateTimeFilter<"XpEvent"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    card?: Prisma.XOR<Prisma.CardNullableScalarRelationFilter, Prisma.CardWhereInput> | null;
};
export type XpEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    cardId?: Prisma.SortOrderInput | Prisma.SortOrder;
    dayKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    xpAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    card?: Prisma.CardOrderByWithRelationInput;
};
export type XpEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    userId_type_cardId?: Prisma.XpEventUserIdTypeCardIdCompoundUniqueInput;
    userId_type_dayKey?: Prisma.XpEventUserIdTypeDayKeyCompoundUniqueInput;
    AND?: Prisma.XpEventWhereInput | Prisma.XpEventWhereInput[];
    OR?: Prisma.XpEventWhereInput[];
    NOT?: Prisma.XpEventWhereInput | Prisma.XpEventWhereInput[];
    userId?: Prisma.IntFilter<"XpEvent"> | number;
    type?: Prisma.EnumXpEventTypeFilter<"XpEvent"> | $Enums.XpEventType;
    cardId?: Prisma.IntNullableFilter<"XpEvent"> | number | null;
    dayKey?: Prisma.DateTimeNullableFilter<"XpEvent"> | Date | string | null;
    xpAmount?: Prisma.IntFilter<"XpEvent"> | number;
    createdAt?: Prisma.DateTimeFilter<"XpEvent"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    card?: Prisma.XOR<Prisma.CardNullableScalarRelationFilter, Prisma.CardWhereInput> | null;
}, "id" | "userId_type_cardId" | "userId_type_dayKey">;
export type XpEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    cardId?: Prisma.SortOrderInput | Prisma.SortOrder;
    dayKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    xpAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.XpEventCountOrderByAggregateInput;
    _avg?: Prisma.XpEventAvgOrderByAggregateInput;
    _max?: Prisma.XpEventMaxOrderByAggregateInput;
    _min?: Prisma.XpEventMinOrderByAggregateInput;
    _sum?: Prisma.XpEventSumOrderByAggregateInput;
};
export type XpEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.XpEventScalarWhereWithAggregatesInput | Prisma.XpEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.XpEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.XpEventScalarWhereWithAggregatesInput | Prisma.XpEventScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"XpEvent"> | number;
    userId?: Prisma.IntWithAggregatesFilter<"XpEvent"> | number;
    type?: Prisma.EnumXpEventTypeWithAggregatesFilter<"XpEvent"> | $Enums.XpEventType;
    cardId?: Prisma.IntNullableWithAggregatesFilter<"XpEvent"> | number | null;
    dayKey?: Prisma.DateTimeNullableWithAggregatesFilter<"XpEvent"> | Date | string | null;
    xpAmount?: Prisma.IntWithAggregatesFilter<"XpEvent"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"XpEvent"> | Date | string;
};
export type XpEventCreateInput = {
    type: $Enums.XpEventType;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutXpEventsInput;
    card?: Prisma.CardCreateNestedOneWithoutXpEventsInput;
};
export type XpEventUncheckedCreateInput = {
    id?: number;
    userId: number;
    type: $Enums.XpEventType;
    cardId?: number | null;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
};
export type XpEventUpdateInput = {
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutXpEventsNestedInput;
    card?: Prisma.CardUpdateOneWithoutXpEventsNestedInput;
};
export type XpEventUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    cardId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type XpEventCreateManyInput = {
    id?: number;
    userId: number;
    type: $Enums.XpEventType;
    cardId?: number | null;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
};
export type XpEventUpdateManyMutationInput = {
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type XpEventUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    cardId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type XpEventListRelationFilter = {
    every?: Prisma.XpEventWhereInput;
    some?: Prisma.XpEventWhereInput;
    none?: Prisma.XpEventWhereInput;
};
export type XpEventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type XpEventUserIdTypeCardIdCompoundUniqueInput = {
    userId: number;
    type: $Enums.XpEventType;
    cardId: number;
};
export type XpEventUserIdTypeDayKeyCompoundUniqueInput = {
    userId: number;
    type: $Enums.XpEventType;
    dayKey: Date | string;
};
export type XpEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    dayKey?: Prisma.SortOrder;
    xpAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type XpEventAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    xpAmount?: Prisma.SortOrder;
};
export type XpEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    dayKey?: Prisma.SortOrder;
    xpAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type XpEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    dayKey?: Prisma.SortOrder;
    xpAmount?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type XpEventSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    xpAmount?: Prisma.SortOrder;
};
export type XpEventCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.XpEventCreateWithoutUserInput, Prisma.XpEventUncheckedCreateWithoutUserInput> | Prisma.XpEventCreateWithoutUserInput[] | Prisma.XpEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.XpEventCreateOrConnectWithoutUserInput | Prisma.XpEventCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.XpEventCreateManyUserInputEnvelope;
    connect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
};
export type XpEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.XpEventCreateWithoutUserInput, Prisma.XpEventUncheckedCreateWithoutUserInput> | Prisma.XpEventCreateWithoutUserInput[] | Prisma.XpEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.XpEventCreateOrConnectWithoutUserInput | Prisma.XpEventCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.XpEventCreateManyUserInputEnvelope;
    connect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
};
export type XpEventUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.XpEventCreateWithoutUserInput, Prisma.XpEventUncheckedCreateWithoutUserInput> | Prisma.XpEventCreateWithoutUserInput[] | Prisma.XpEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.XpEventCreateOrConnectWithoutUserInput | Prisma.XpEventCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.XpEventUpsertWithWhereUniqueWithoutUserInput | Prisma.XpEventUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.XpEventCreateManyUserInputEnvelope;
    set?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    disconnect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    delete?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    connect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    update?: Prisma.XpEventUpdateWithWhereUniqueWithoutUserInput | Prisma.XpEventUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.XpEventUpdateManyWithWhereWithoutUserInput | Prisma.XpEventUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.XpEventScalarWhereInput | Prisma.XpEventScalarWhereInput[];
};
export type XpEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.XpEventCreateWithoutUserInput, Prisma.XpEventUncheckedCreateWithoutUserInput> | Prisma.XpEventCreateWithoutUserInput[] | Prisma.XpEventUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.XpEventCreateOrConnectWithoutUserInput | Prisma.XpEventCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.XpEventUpsertWithWhereUniqueWithoutUserInput | Prisma.XpEventUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.XpEventCreateManyUserInputEnvelope;
    set?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    disconnect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    delete?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    connect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    update?: Prisma.XpEventUpdateWithWhereUniqueWithoutUserInput | Prisma.XpEventUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.XpEventUpdateManyWithWhereWithoutUserInput | Prisma.XpEventUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.XpEventScalarWhereInput | Prisma.XpEventScalarWhereInput[];
};
export type XpEventCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.XpEventCreateWithoutCardInput, Prisma.XpEventUncheckedCreateWithoutCardInput> | Prisma.XpEventCreateWithoutCardInput[] | Prisma.XpEventUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.XpEventCreateOrConnectWithoutCardInput | Prisma.XpEventCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.XpEventCreateManyCardInputEnvelope;
    connect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
};
export type XpEventUncheckedCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.XpEventCreateWithoutCardInput, Prisma.XpEventUncheckedCreateWithoutCardInput> | Prisma.XpEventCreateWithoutCardInput[] | Prisma.XpEventUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.XpEventCreateOrConnectWithoutCardInput | Prisma.XpEventCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.XpEventCreateManyCardInputEnvelope;
    connect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
};
export type XpEventUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.XpEventCreateWithoutCardInput, Prisma.XpEventUncheckedCreateWithoutCardInput> | Prisma.XpEventCreateWithoutCardInput[] | Prisma.XpEventUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.XpEventCreateOrConnectWithoutCardInput | Prisma.XpEventCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.XpEventUpsertWithWhereUniqueWithoutCardInput | Prisma.XpEventUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.XpEventCreateManyCardInputEnvelope;
    set?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    disconnect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    delete?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    connect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    update?: Prisma.XpEventUpdateWithWhereUniqueWithoutCardInput | Prisma.XpEventUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.XpEventUpdateManyWithWhereWithoutCardInput | Prisma.XpEventUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.XpEventScalarWhereInput | Prisma.XpEventScalarWhereInput[];
};
export type XpEventUncheckedUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.XpEventCreateWithoutCardInput, Prisma.XpEventUncheckedCreateWithoutCardInput> | Prisma.XpEventCreateWithoutCardInput[] | Prisma.XpEventUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.XpEventCreateOrConnectWithoutCardInput | Prisma.XpEventCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.XpEventUpsertWithWhereUniqueWithoutCardInput | Prisma.XpEventUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.XpEventCreateManyCardInputEnvelope;
    set?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    disconnect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    delete?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    connect?: Prisma.XpEventWhereUniqueInput | Prisma.XpEventWhereUniqueInput[];
    update?: Prisma.XpEventUpdateWithWhereUniqueWithoutCardInput | Prisma.XpEventUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.XpEventUpdateManyWithWhereWithoutCardInput | Prisma.XpEventUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.XpEventScalarWhereInput | Prisma.XpEventScalarWhereInput[];
};
export type EnumXpEventTypeFieldUpdateOperationsInput = {
    set?: $Enums.XpEventType;
};
export type XpEventCreateWithoutUserInput = {
    type: $Enums.XpEventType;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
    card?: Prisma.CardCreateNestedOneWithoutXpEventsInput;
};
export type XpEventUncheckedCreateWithoutUserInput = {
    id?: number;
    type: $Enums.XpEventType;
    cardId?: number | null;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
};
export type XpEventCreateOrConnectWithoutUserInput = {
    where: Prisma.XpEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.XpEventCreateWithoutUserInput, Prisma.XpEventUncheckedCreateWithoutUserInput>;
};
export type XpEventCreateManyUserInputEnvelope = {
    data: Prisma.XpEventCreateManyUserInput | Prisma.XpEventCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type XpEventUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.XpEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.XpEventUpdateWithoutUserInput, Prisma.XpEventUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.XpEventCreateWithoutUserInput, Prisma.XpEventUncheckedCreateWithoutUserInput>;
};
export type XpEventUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.XpEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.XpEventUpdateWithoutUserInput, Prisma.XpEventUncheckedUpdateWithoutUserInput>;
};
export type XpEventUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.XpEventScalarWhereInput;
    data: Prisma.XOR<Prisma.XpEventUpdateManyMutationInput, Prisma.XpEventUncheckedUpdateManyWithoutUserInput>;
};
export type XpEventScalarWhereInput = {
    AND?: Prisma.XpEventScalarWhereInput | Prisma.XpEventScalarWhereInput[];
    OR?: Prisma.XpEventScalarWhereInput[];
    NOT?: Prisma.XpEventScalarWhereInput | Prisma.XpEventScalarWhereInput[];
    id?: Prisma.IntFilter<"XpEvent"> | number;
    userId?: Prisma.IntFilter<"XpEvent"> | number;
    type?: Prisma.EnumXpEventTypeFilter<"XpEvent"> | $Enums.XpEventType;
    cardId?: Prisma.IntNullableFilter<"XpEvent"> | number | null;
    dayKey?: Prisma.DateTimeNullableFilter<"XpEvent"> | Date | string | null;
    xpAmount?: Prisma.IntFilter<"XpEvent"> | number;
    createdAt?: Prisma.DateTimeFilter<"XpEvent"> | Date | string;
};
export type XpEventCreateWithoutCardInput = {
    type: $Enums.XpEventType;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutXpEventsInput;
};
export type XpEventUncheckedCreateWithoutCardInput = {
    id?: number;
    userId: number;
    type: $Enums.XpEventType;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
};
export type XpEventCreateOrConnectWithoutCardInput = {
    where: Prisma.XpEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.XpEventCreateWithoutCardInput, Prisma.XpEventUncheckedCreateWithoutCardInput>;
};
export type XpEventCreateManyCardInputEnvelope = {
    data: Prisma.XpEventCreateManyCardInput | Prisma.XpEventCreateManyCardInput[];
    skipDuplicates?: boolean;
};
export type XpEventUpsertWithWhereUniqueWithoutCardInput = {
    where: Prisma.XpEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.XpEventUpdateWithoutCardInput, Prisma.XpEventUncheckedUpdateWithoutCardInput>;
    create: Prisma.XOR<Prisma.XpEventCreateWithoutCardInput, Prisma.XpEventUncheckedCreateWithoutCardInput>;
};
export type XpEventUpdateWithWhereUniqueWithoutCardInput = {
    where: Prisma.XpEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.XpEventUpdateWithoutCardInput, Prisma.XpEventUncheckedUpdateWithoutCardInput>;
};
export type XpEventUpdateManyWithWhereWithoutCardInput = {
    where: Prisma.XpEventScalarWhereInput;
    data: Prisma.XOR<Prisma.XpEventUpdateManyMutationInput, Prisma.XpEventUncheckedUpdateManyWithoutCardInput>;
};
export type XpEventCreateManyUserInput = {
    id?: number;
    type: $Enums.XpEventType;
    cardId?: number | null;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
};
export type XpEventUpdateWithoutUserInput = {
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.CardUpdateOneWithoutXpEventsNestedInput;
};
export type XpEventUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    cardId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type XpEventUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    cardId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type XpEventCreateManyCardInput = {
    id?: number;
    userId: number;
    type: $Enums.XpEventType;
    dayKey?: Date | string | null;
    xpAmount: number;
    createdAt?: Date | string;
};
export type XpEventUpdateWithoutCardInput = {
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutXpEventsNestedInput;
};
export type XpEventUncheckedUpdateWithoutCardInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type XpEventUncheckedUpdateManyWithoutCardInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumXpEventTypeFieldUpdateOperationsInput | $Enums.XpEventType;
    dayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    xpAmount?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type XpEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    cardId?: boolean;
    dayKey?: boolean;
    xpAmount?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.XpEvent$cardArgs<ExtArgs>;
}, ExtArgs["result"]["xpEvent"]>;
export type XpEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    cardId?: boolean;
    dayKey?: boolean;
    xpAmount?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.XpEvent$cardArgs<ExtArgs>;
}, ExtArgs["result"]["xpEvent"]>;
export type XpEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    cardId?: boolean;
    dayKey?: boolean;
    xpAmount?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.XpEvent$cardArgs<ExtArgs>;
}, ExtArgs["result"]["xpEvent"]>;
export type XpEventSelectScalar = {
    id?: boolean;
    userId?: boolean;
    type?: boolean;
    cardId?: boolean;
    dayKey?: boolean;
    xpAmount?: boolean;
    createdAt?: boolean;
};
export type XpEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "type" | "cardId" | "dayKey" | "xpAmount" | "createdAt", ExtArgs["result"]["xpEvent"]>;
export type XpEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.XpEvent$cardArgs<ExtArgs>;
};
export type XpEventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.XpEvent$cardArgs<ExtArgs>;
};
export type XpEventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    card?: boolean | Prisma.XpEvent$cardArgs<ExtArgs>;
};
export type $XpEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "XpEvent";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        card: Prisma.$CardPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        userId: number;
        type: $Enums.XpEventType;
        cardId: number | null;
        dayKey: Date | null;
        xpAmount: number;
        createdAt: Date;
    }, ExtArgs["result"]["xpEvent"]>;
    composites: {};
};
export type XpEventGetPayload<S extends boolean | null | undefined | XpEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$XpEventPayload, S>;
export type XpEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<XpEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: XpEventCountAggregateInputType | true;
};
export interface XpEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['XpEvent'];
        meta: {
            name: 'XpEvent';
        };
    };
    findUnique<T extends XpEventFindUniqueArgs>(args: Prisma.SelectSubset<T, XpEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__XpEventClient<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends XpEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, XpEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__XpEventClient<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends XpEventFindFirstArgs>(args?: Prisma.SelectSubset<T, XpEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__XpEventClient<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends XpEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, XpEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__XpEventClient<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends XpEventFindManyArgs>(args?: Prisma.SelectSubset<T, XpEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends XpEventCreateArgs>(args: Prisma.SelectSubset<T, XpEventCreateArgs<ExtArgs>>): Prisma.Prisma__XpEventClient<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends XpEventCreateManyArgs>(args?: Prisma.SelectSubset<T, XpEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends XpEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, XpEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends XpEventDeleteArgs>(args: Prisma.SelectSubset<T, XpEventDeleteArgs<ExtArgs>>): Prisma.Prisma__XpEventClient<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends XpEventUpdateArgs>(args: Prisma.SelectSubset<T, XpEventUpdateArgs<ExtArgs>>): Prisma.Prisma__XpEventClient<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends XpEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, XpEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends XpEventUpdateManyArgs>(args: Prisma.SelectSubset<T, XpEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends XpEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, XpEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends XpEventUpsertArgs>(args: Prisma.SelectSubset<T, XpEventUpsertArgs<ExtArgs>>): Prisma.Prisma__XpEventClient<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends XpEventCountArgs>(args?: Prisma.Subset<T, XpEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], XpEventCountAggregateOutputType> : number>;
    aggregate<T extends XpEventAggregateArgs>(args: Prisma.Subset<T, XpEventAggregateArgs>): Prisma.PrismaPromise<GetXpEventAggregateType<T>>;
    groupBy<T extends XpEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: XpEventGroupByArgs['orderBy'];
    } : {
        orderBy?: XpEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, XpEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetXpEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: XpEventFieldRefs;
}
export interface Prisma__XpEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    card<T extends Prisma.XpEvent$cardArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.XpEvent$cardArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface XpEventFieldRefs {
    readonly id: Prisma.FieldRef<"XpEvent", 'Int'>;
    readonly userId: Prisma.FieldRef<"XpEvent", 'Int'>;
    readonly type: Prisma.FieldRef<"XpEvent", 'XpEventType'>;
    readonly cardId: Prisma.FieldRef<"XpEvent", 'Int'>;
    readonly dayKey: Prisma.FieldRef<"XpEvent", 'DateTime'>;
    readonly xpAmount: Prisma.FieldRef<"XpEvent", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"XpEvent", 'DateTime'>;
}
export type XpEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    where: Prisma.XpEventWhereUniqueInput;
};
export type XpEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    where: Prisma.XpEventWhereUniqueInput;
};
export type XpEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    where?: Prisma.XpEventWhereInput;
    orderBy?: Prisma.XpEventOrderByWithRelationInput | Prisma.XpEventOrderByWithRelationInput[];
    cursor?: Prisma.XpEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.XpEventScalarFieldEnum | Prisma.XpEventScalarFieldEnum[];
};
export type XpEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    where?: Prisma.XpEventWhereInput;
    orderBy?: Prisma.XpEventOrderByWithRelationInput | Prisma.XpEventOrderByWithRelationInput[];
    cursor?: Prisma.XpEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.XpEventScalarFieldEnum | Prisma.XpEventScalarFieldEnum[];
};
export type XpEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    where?: Prisma.XpEventWhereInput;
    orderBy?: Prisma.XpEventOrderByWithRelationInput | Prisma.XpEventOrderByWithRelationInput[];
    cursor?: Prisma.XpEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.XpEventScalarFieldEnum | Prisma.XpEventScalarFieldEnum[];
};
export type XpEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.XpEventCreateInput, Prisma.XpEventUncheckedCreateInput>;
};
export type XpEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XpEventCreateManyInput | Prisma.XpEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type XpEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    data: Prisma.XpEventCreateManyInput | Prisma.XpEventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.XpEventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type XpEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.XpEventUpdateInput, Prisma.XpEventUncheckedUpdateInput>;
    where: Prisma.XpEventWhereUniqueInput;
};
export type XpEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.XpEventUpdateManyMutationInput, Prisma.XpEventUncheckedUpdateManyInput>;
    where?: Prisma.XpEventWhereInput;
    limit?: number;
};
export type XpEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.XpEventUpdateManyMutationInput, Prisma.XpEventUncheckedUpdateManyInput>;
    where?: Prisma.XpEventWhereInput;
    limit?: number;
    include?: Prisma.XpEventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type XpEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    where: Prisma.XpEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.XpEventCreateInput, Prisma.XpEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.XpEventUpdateInput, Prisma.XpEventUncheckedUpdateInput>;
};
export type XpEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
    where: Prisma.XpEventWhereUniqueInput;
};
export type XpEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.XpEventWhereInput;
    limit?: number;
};
export type XpEvent$cardArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    where?: Prisma.CardWhereInput;
};
export type XpEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.XpEventSelect<ExtArgs> | null;
    omit?: Prisma.XpEventOmit<ExtArgs> | null;
    include?: Prisma.XpEventInclude<ExtArgs> | null;
};
export {};
