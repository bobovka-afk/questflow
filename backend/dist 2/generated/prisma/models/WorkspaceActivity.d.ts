import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type WorkspaceActivityModel = runtime.Types.Result.DefaultSelection<Prisma.$WorkspaceActivityPayload>;
export type AggregateWorkspaceActivity = {
    _count: WorkspaceActivityCountAggregateOutputType | null;
    _avg: WorkspaceActivityAvgAggregateOutputType | null;
    _sum: WorkspaceActivitySumAggregateOutputType | null;
    _min: WorkspaceActivityMinAggregateOutputType | null;
    _max: WorkspaceActivityMaxAggregateOutputType | null;
};
export type WorkspaceActivityAvgAggregateOutputType = {
    id: number | null;
    workspaceId: number | null;
    actorUserId: number | null;
};
export type WorkspaceActivitySumAggregateOutputType = {
    id: number | null;
    workspaceId: number | null;
    actorUserId: number | null;
};
export type WorkspaceActivityMinAggregateOutputType = {
    id: number | null;
    workspaceId: number | null;
    actorUserId: number | null;
    type: $Enums.WorkspaceActivityType | null;
    createdAt: Date | null;
};
export type WorkspaceActivityMaxAggregateOutputType = {
    id: number | null;
    workspaceId: number | null;
    actorUserId: number | null;
    type: $Enums.WorkspaceActivityType | null;
    createdAt: Date | null;
};
export type WorkspaceActivityCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    actorUserId: number;
    type: number;
    payload: number;
    createdAt: number;
    _all: number;
};
export type WorkspaceActivityAvgAggregateInputType = {
    id?: true;
    workspaceId?: true;
    actorUserId?: true;
};
export type WorkspaceActivitySumAggregateInputType = {
    id?: true;
    workspaceId?: true;
    actorUserId?: true;
};
export type WorkspaceActivityMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    actorUserId?: true;
    type?: true;
    createdAt?: true;
};
export type WorkspaceActivityMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    actorUserId?: true;
    type?: true;
    createdAt?: true;
};
export type WorkspaceActivityCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    actorUserId?: true;
    type?: true;
    payload?: true;
    createdAt?: true;
    _all?: true;
};
export type WorkspaceActivityAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceActivityWhereInput;
    orderBy?: Prisma.WorkspaceActivityOrderByWithRelationInput | Prisma.WorkspaceActivityOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceActivityWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | WorkspaceActivityCountAggregateInputType;
    _avg?: WorkspaceActivityAvgAggregateInputType;
    _sum?: WorkspaceActivitySumAggregateInputType;
    _min?: WorkspaceActivityMinAggregateInputType;
    _max?: WorkspaceActivityMaxAggregateInputType;
};
export type GetWorkspaceActivityAggregateType<T extends WorkspaceActivityAggregateArgs> = {
    [P in keyof T & keyof AggregateWorkspaceActivity]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateWorkspaceActivity[P]> : Prisma.GetScalarType<T[P], AggregateWorkspaceActivity[P]>;
};
export type WorkspaceActivityGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceActivityWhereInput;
    orderBy?: Prisma.WorkspaceActivityOrderByWithAggregationInput | Prisma.WorkspaceActivityOrderByWithAggregationInput[];
    by: Prisma.WorkspaceActivityScalarFieldEnum[] | Prisma.WorkspaceActivityScalarFieldEnum;
    having?: Prisma.WorkspaceActivityScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: WorkspaceActivityCountAggregateInputType | true;
    _avg?: WorkspaceActivityAvgAggregateInputType;
    _sum?: WorkspaceActivitySumAggregateInputType;
    _min?: WorkspaceActivityMinAggregateInputType;
    _max?: WorkspaceActivityMaxAggregateInputType;
};
export type WorkspaceActivityGroupByOutputType = {
    id: number;
    workspaceId: number;
    actorUserId: number;
    type: $Enums.WorkspaceActivityType;
    payload: runtime.JsonValue;
    createdAt: Date;
    _count: WorkspaceActivityCountAggregateOutputType | null;
    _avg: WorkspaceActivityAvgAggregateOutputType | null;
    _sum: WorkspaceActivitySumAggregateOutputType | null;
    _min: WorkspaceActivityMinAggregateOutputType | null;
    _max: WorkspaceActivityMaxAggregateOutputType | null;
};
type GetWorkspaceActivityGroupByPayload<T extends WorkspaceActivityGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<WorkspaceActivityGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof WorkspaceActivityGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], WorkspaceActivityGroupByOutputType[P]> : Prisma.GetScalarType<T[P], WorkspaceActivityGroupByOutputType[P]>;
}>>;
export type WorkspaceActivityWhereInput = {
    AND?: Prisma.WorkspaceActivityWhereInput | Prisma.WorkspaceActivityWhereInput[];
    OR?: Prisma.WorkspaceActivityWhereInput[];
    NOT?: Prisma.WorkspaceActivityWhereInput | Prisma.WorkspaceActivityWhereInput[];
    id?: Prisma.IntFilter<"WorkspaceActivity"> | number;
    workspaceId?: Prisma.IntFilter<"WorkspaceActivity"> | number;
    actorUserId?: Prisma.IntFilter<"WorkspaceActivity"> | number;
    type?: Prisma.EnumWorkspaceActivityTypeFilter<"WorkspaceActivity"> | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonFilter<"WorkspaceActivity">;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceActivity"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type WorkspaceActivityOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    actorUserId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    actor?: Prisma.UserOrderByWithRelationInput;
};
export type WorkspaceActivityWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.WorkspaceActivityWhereInput | Prisma.WorkspaceActivityWhereInput[];
    OR?: Prisma.WorkspaceActivityWhereInput[];
    NOT?: Prisma.WorkspaceActivityWhereInput | Prisma.WorkspaceActivityWhereInput[];
    workspaceId?: Prisma.IntFilter<"WorkspaceActivity"> | number;
    actorUserId?: Prisma.IntFilter<"WorkspaceActivity"> | number;
    type?: Prisma.EnumWorkspaceActivityTypeFilter<"WorkspaceActivity"> | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonFilter<"WorkspaceActivity">;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceActivity"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    actor?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type WorkspaceActivityOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    actorUserId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.WorkspaceActivityCountOrderByAggregateInput;
    _avg?: Prisma.WorkspaceActivityAvgOrderByAggregateInput;
    _max?: Prisma.WorkspaceActivityMaxOrderByAggregateInput;
    _min?: Prisma.WorkspaceActivityMinOrderByAggregateInput;
    _sum?: Prisma.WorkspaceActivitySumOrderByAggregateInput;
};
export type WorkspaceActivityScalarWhereWithAggregatesInput = {
    AND?: Prisma.WorkspaceActivityScalarWhereWithAggregatesInput | Prisma.WorkspaceActivityScalarWhereWithAggregatesInput[];
    OR?: Prisma.WorkspaceActivityScalarWhereWithAggregatesInput[];
    NOT?: Prisma.WorkspaceActivityScalarWhereWithAggregatesInput | Prisma.WorkspaceActivityScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"WorkspaceActivity"> | number;
    workspaceId?: Prisma.IntWithAggregatesFilter<"WorkspaceActivity"> | number;
    actorUserId?: Prisma.IntWithAggregatesFilter<"WorkspaceActivity"> | number;
    type?: Prisma.EnumWorkspaceActivityTypeWithAggregatesFilter<"WorkspaceActivity"> | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonWithAggregatesFilter<"WorkspaceActivity">;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"WorkspaceActivity"> | Date | string;
};
export type WorkspaceActivityCreateInput = {
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutActivitiesInput;
    actor: Prisma.UserCreateNestedOneWithoutWorkspaceActivitiesInput;
};
export type WorkspaceActivityUncheckedCreateInput = {
    id?: number;
    workspaceId: number;
    actorUserId: number;
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type WorkspaceActivityUpdateInput = {
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutActivitiesNestedInput;
    actor?: Prisma.UserUpdateOneRequiredWithoutWorkspaceActivitiesNestedInput;
};
export type WorkspaceActivityUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    workspaceId?: Prisma.IntFieldUpdateOperationsInput | number;
    actorUserId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceActivityCreateManyInput = {
    id?: number;
    workspaceId: number;
    actorUserId: number;
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type WorkspaceActivityUpdateManyMutationInput = {
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceActivityUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    workspaceId?: Prisma.IntFieldUpdateOperationsInput | number;
    actorUserId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceActivityListRelationFilter = {
    every?: Prisma.WorkspaceActivityWhereInput;
    some?: Prisma.WorkspaceActivityWhereInput;
    none?: Prisma.WorkspaceActivityWhereInput;
};
export type WorkspaceActivityOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type WorkspaceActivityCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    actorUserId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    payload?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceActivityAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    actorUserId?: Prisma.SortOrder;
};
export type WorkspaceActivityMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    actorUserId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceActivityMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    actorUserId?: Prisma.SortOrder;
    type?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type WorkspaceActivitySumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    actorUserId?: Prisma.SortOrder;
};
export type WorkspaceActivityCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutActorInput, Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput> | Prisma.WorkspaceActivityCreateWithoutActorInput[] | Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.WorkspaceActivityCreateOrConnectWithoutActorInput | Prisma.WorkspaceActivityCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.WorkspaceActivityCreateManyActorInputEnvelope;
    connect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
};
export type WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput = {
    create?: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutActorInput, Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput> | Prisma.WorkspaceActivityCreateWithoutActorInput[] | Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.WorkspaceActivityCreateOrConnectWithoutActorInput | Prisma.WorkspaceActivityCreateOrConnectWithoutActorInput[];
    createMany?: Prisma.WorkspaceActivityCreateManyActorInputEnvelope;
    connect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
};
export type WorkspaceActivityUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutActorInput, Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput> | Prisma.WorkspaceActivityCreateWithoutActorInput[] | Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.WorkspaceActivityCreateOrConnectWithoutActorInput | Prisma.WorkspaceActivityCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.WorkspaceActivityUpsertWithWhereUniqueWithoutActorInput | Prisma.WorkspaceActivityUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.WorkspaceActivityCreateManyActorInputEnvelope;
    set?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    delete?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    connect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    update?: Prisma.WorkspaceActivityUpdateWithWhereUniqueWithoutActorInput | Prisma.WorkspaceActivityUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.WorkspaceActivityUpdateManyWithWhereWithoutActorInput | Prisma.WorkspaceActivityUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.WorkspaceActivityScalarWhereInput | Prisma.WorkspaceActivityScalarWhereInput[];
};
export type WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutActorInput, Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput> | Prisma.WorkspaceActivityCreateWithoutActorInput[] | Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput[];
    connectOrCreate?: Prisma.WorkspaceActivityCreateOrConnectWithoutActorInput | Prisma.WorkspaceActivityCreateOrConnectWithoutActorInput[];
    upsert?: Prisma.WorkspaceActivityUpsertWithWhereUniqueWithoutActorInput | Prisma.WorkspaceActivityUpsertWithWhereUniqueWithoutActorInput[];
    createMany?: Prisma.WorkspaceActivityCreateManyActorInputEnvelope;
    set?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    delete?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    connect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    update?: Prisma.WorkspaceActivityUpdateWithWhereUniqueWithoutActorInput | Prisma.WorkspaceActivityUpdateWithWhereUniqueWithoutActorInput[];
    updateMany?: Prisma.WorkspaceActivityUpdateManyWithWhereWithoutActorInput | Prisma.WorkspaceActivityUpdateManyWithWhereWithoutActorInput[];
    deleteMany?: Prisma.WorkspaceActivityScalarWhereInput | Prisma.WorkspaceActivityScalarWhereInput[];
};
export type WorkspaceActivityCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutWorkspaceInput, Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceActivityCreateWithoutWorkspaceInput[] | Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceActivityCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceActivityCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceActivityCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
};
export type WorkspaceActivityUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutWorkspaceInput, Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceActivityCreateWithoutWorkspaceInput[] | Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceActivityCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceActivityCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceActivityCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
};
export type WorkspaceActivityUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutWorkspaceInput, Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceActivityCreateWithoutWorkspaceInput[] | Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceActivityCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceActivityCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.WorkspaceActivityUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceActivityUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceActivityCreateManyWorkspaceInputEnvelope;
    set?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    delete?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    connect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    update?: Prisma.WorkspaceActivityUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceActivityUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.WorkspaceActivityUpdateManyWithWhereWithoutWorkspaceInput | Prisma.WorkspaceActivityUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.WorkspaceActivityScalarWhereInput | Prisma.WorkspaceActivityScalarWhereInput[];
};
export type WorkspaceActivityUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutWorkspaceInput, Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput> | Prisma.WorkspaceActivityCreateWithoutWorkspaceInput[] | Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.WorkspaceActivityCreateOrConnectWithoutWorkspaceInput | Prisma.WorkspaceActivityCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.WorkspaceActivityUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceActivityUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.WorkspaceActivityCreateManyWorkspaceInputEnvelope;
    set?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    disconnect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    delete?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    connect?: Prisma.WorkspaceActivityWhereUniqueInput | Prisma.WorkspaceActivityWhereUniqueInput[];
    update?: Prisma.WorkspaceActivityUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.WorkspaceActivityUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.WorkspaceActivityUpdateManyWithWhereWithoutWorkspaceInput | Prisma.WorkspaceActivityUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.WorkspaceActivityScalarWhereInput | Prisma.WorkspaceActivityScalarWhereInput[];
};
export type EnumWorkspaceActivityTypeFieldUpdateOperationsInput = {
    set?: $Enums.WorkspaceActivityType;
};
export type WorkspaceActivityCreateWithoutActorInput = {
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutActivitiesInput;
};
export type WorkspaceActivityUncheckedCreateWithoutActorInput = {
    id?: number;
    workspaceId: number;
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type WorkspaceActivityCreateOrConnectWithoutActorInput = {
    where: Prisma.WorkspaceActivityWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutActorInput, Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput>;
};
export type WorkspaceActivityCreateManyActorInputEnvelope = {
    data: Prisma.WorkspaceActivityCreateManyActorInput | Prisma.WorkspaceActivityCreateManyActorInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceActivityUpsertWithWhereUniqueWithoutActorInput = {
    where: Prisma.WorkspaceActivityWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkspaceActivityUpdateWithoutActorInput, Prisma.WorkspaceActivityUncheckedUpdateWithoutActorInput>;
    create: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutActorInput, Prisma.WorkspaceActivityUncheckedCreateWithoutActorInput>;
};
export type WorkspaceActivityUpdateWithWhereUniqueWithoutActorInput = {
    where: Prisma.WorkspaceActivityWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkspaceActivityUpdateWithoutActorInput, Prisma.WorkspaceActivityUncheckedUpdateWithoutActorInput>;
};
export type WorkspaceActivityUpdateManyWithWhereWithoutActorInput = {
    where: Prisma.WorkspaceActivityScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceActivityUpdateManyMutationInput, Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorInput>;
};
export type WorkspaceActivityScalarWhereInput = {
    AND?: Prisma.WorkspaceActivityScalarWhereInput | Prisma.WorkspaceActivityScalarWhereInput[];
    OR?: Prisma.WorkspaceActivityScalarWhereInput[];
    NOT?: Prisma.WorkspaceActivityScalarWhereInput | Prisma.WorkspaceActivityScalarWhereInput[];
    id?: Prisma.IntFilter<"WorkspaceActivity"> | number;
    workspaceId?: Prisma.IntFilter<"WorkspaceActivity"> | number;
    actorUserId?: Prisma.IntFilter<"WorkspaceActivity"> | number;
    type?: Prisma.EnumWorkspaceActivityTypeFilter<"WorkspaceActivity"> | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonFilter<"WorkspaceActivity">;
    createdAt?: Prisma.DateTimeFilter<"WorkspaceActivity"> | Date | string;
};
export type WorkspaceActivityCreateWithoutWorkspaceInput = {
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
    actor: Prisma.UserCreateNestedOneWithoutWorkspaceActivitiesInput;
};
export type WorkspaceActivityUncheckedCreateWithoutWorkspaceInput = {
    id?: number;
    actorUserId: number;
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type WorkspaceActivityCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.WorkspaceActivityWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutWorkspaceInput, Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput>;
};
export type WorkspaceActivityCreateManyWorkspaceInputEnvelope = {
    data: Prisma.WorkspaceActivityCreateManyWorkspaceInput | Prisma.WorkspaceActivityCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceActivityUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.WorkspaceActivityWhereUniqueInput;
    update: Prisma.XOR<Prisma.WorkspaceActivityUpdateWithoutWorkspaceInput, Prisma.WorkspaceActivityUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.WorkspaceActivityCreateWithoutWorkspaceInput, Prisma.WorkspaceActivityUncheckedCreateWithoutWorkspaceInput>;
};
export type WorkspaceActivityUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.WorkspaceActivityWhereUniqueInput;
    data: Prisma.XOR<Prisma.WorkspaceActivityUpdateWithoutWorkspaceInput, Prisma.WorkspaceActivityUncheckedUpdateWithoutWorkspaceInput>;
};
export type WorkspaceActivityUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.WorkspaceActivityScalarWhereInput;
    data: Prisma.XOR<Prisma.WorkspaceActivityUpdateManyMutationInput, Prisma.WorkspaceActivityUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type WorkspaceActivityCreateManyActorInput = {
    id?: number;
    workspaceId: number;
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type WorkspaceActivityUpdateWithoutActorInput = {
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutActivitiesNestedInput;
};
export type WorkspaceActivityUncheckedUpdateWithoutActorInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    workspaceId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceActivityUncheckedUpdateManyWithoutActorInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    workspaceId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceActivityCreateManyWorkspaceInput = {
    id?: number;
    actorUserId: number;
    type: $Enums.WorkspaceActivityType;
    payload: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Date | string;
};
export type WorkspaceActivityUpdateWithoutWorkspaceInput = {
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    actor?: Prisma.UserUpdateOneRequiredWithoutWorkspaceActivitiesNestedInput;
};
export type WorkspaceActivityUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    actorUserId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceActivityUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    actorUserId?: Prisma.IntFieldUpdateOperationsInput | number;
    type?: Prisma.EnumWorkspaceActivityTypeFieldUpdateOperationsInput | $Enums.WorkspaceActivityType;
    payload?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type WorkspaceActivitySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    actorUserId?: boolean;
    type?: boolean;
    payload?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceActivity"]>;
export type WorkspaceActivitySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    actorUserId?: boolean;
    type?: boolean;
    payload?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceActivity"]>;
export type WorkspaceActivitySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    actorUserId?: boolean;
    type?: boolean;
    payload?: boolean;
    createdAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["workspaceActivity"]>;
export type WorkspaceActivitySelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    actorUserId?: boolean;
    type?: boolean;
    payload?: boolean;
    createdAt?: boolean;
};
export type WorkspaceActivityOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "actorUserId" | "type" | "payload" | "createdAt", ExtArgs["result"]["workspaceActivity"]>;
export type WorkspaceActivityInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type WorkspaceActivityIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type WorkspaceActivityIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    actor?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $WorkspaceActivityPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "WorkspaceActivity";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        actor: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        workspaceId: number;
        actorUserId: number;
        type: $Enums.WorkspaceActivityType;
        payload: runtime.JsonValue;
        createdAt: Date;
    }, ExtArgs["result"]["workspaceActivity"]>;
    composites: {};
};
export type WorkspaceActivityGetPayload<S extends boolean | null | undefined | WorkspaceActivityDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload, S>;
export type WorkspaceActivityCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<WorkspaceActivityFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: WorkspaceActivityCountAggregateInputType | true;
};
export interface WorkspaceActivityDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['WorkspaceActivity'];
        meta: {
            name: 'WorkspaceActivity';
        };
    };
    findUnique<T extends WorkspaceActivityFindUniqueArgs>(args: Prisma.SelectSubset<T, WorkspaceActivityFindUniqueArgs<ExtArgs>>): Prisma.Prisma__WorkspaceActivityClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends WorkspaceActivityFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, WorkspaceActivityFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceActivityClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends WorkspaceActivityFindFirstArgs>(args?: Prisma.SelectSubset<T, WorkspaceActivityFindFirstArgs<ExtArgs>>): Prisma.Prisma__WorkspaceActivityClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends WorkspaceActivityFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, WorkspaceActivityFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__WorkspaceActivityClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends WorkspaceActivityFindManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceActivityFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends WorkspaceActivityCreateArgs>(args: Prisma.SelectSubset<T, WorkspaceActivityCreateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceActivityClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends WorkspaceActivityCreateManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceActivityCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends WorkspaceActivityCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, WorkspaceActivityCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends WorkspaceActivityDeleteArgs>(args: Prisma.SelectSubset<T, WorkspaceActivityDeleteArgs<ExtArgs>>): Prisma.Prisma__WorkspaceActivityClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends WorkspaceActivityUpdateArgs>(args: Prisma.SelectSubset<T, WorkspaceActivityUpdateArgs<ExtArgs>>): Prisma.Prisma__WorkspaceActivityClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends WorkspaceActivityDeleteManyArgs>(args?: Prisma.SelectSubset<T, WorkspaceActivityDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends WorkspaceActivityUpdateManyArgs>(args: Prisma.SelectSubset<T, WorkspaceActivityUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends WorkspaceActivityUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, WorkspaceActivityUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends WorkspaceActivityUpsertArgs>(args: Prisma.SelectSubset<T, WorkspaceActivityUpsertArgs<ExtArgs>>): Prisma.Prisma__WorkspaceActivityClient<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends WorkspaceActivityCountArgs>(args?: Prisma.Subset<T, WorkspaceActivityCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], WorkspaceActivityCountAggregateOutputType> : number>;
    aggregate<T extends WorkspaceActivityAggregateArgs>(args: Prisma.Subset<T, WorkspaceActivityAggregateArgs>): Prisma.PrismaPromise<GetWorkspaceActivityAggregateType<T>>;
    groupBy<T extends WorkspaceActivityGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: WorkspaceActivityGroupByArgs['orderBy'];
    } : {
        orderBy?: WorkspaceActivityGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, WorkspaceActivityGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetWorkspaceActivityGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: WorkspaceActivityFieldRefs;
}
export interface Prisma__WorkspaceActivityClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    actor<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface WorkspaceActivityFieldRefs {
    readonly id: Prisma.FieldRef<"WorkspaceActivity", 'Int'>;
    readonly workspaceId: Prisma.FieldRef<"WorkspaceActivity", 'Int'>;
    readonly actorUserId: Prisma.FieldRef<"WorkspaceActivity", 'Int'>;
    readonly type: Prisma.FieldRef<"WorkspaceActivity", 'WorkspaceActivityType'>;
    readonly payload: Prisma.FieldRef<"WorkspaceActivity", 'Json'>;
    readonly createdAt: Prisma.FieldRef<"WorkspaceActivity", 'DateTime'>;
}
export type WorkspaceActivityFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    where: Prisma.WorkspaceActivityWhereUniqueInput;
};
export type WorkspaceActivityFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    where: Prisma.WorkspaceActivityWhereUniqueInput;
};
export type WorkspaceActivityFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceActivityWhereInput;
    orderBy?: Prisma.WorkspaceActivityOrderByWithRelationInput | Prisma.WorkspaceActivityOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceActivityWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceActivityScalarFieldEnum | Prisma.WorkspaceActivityScalarFieldEnum[];
};
export type WorkspaceActivityFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceActivityWhereInput;
    orderBy?: Prisma.WorkspaceActivityOrderByWithRelationInput | Prisma.WorkspaceActivityOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceActivityWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceActivityScalarFieldEnum | Prisma.WorkspaceActivityScalarFieldEnum[];
};
export type WorkspaceActivityFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceActivityWhereInput;
    orderBy?: Prisma.WorkspaceActivityOrderByWithRelationInput | Prisma.WorkspaceActivityOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceActivityWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceActivityScalarFieldEnum | Prisma.WorkspaceActivityScalarFieldEnum[];
};
export type WorkspaceActivityCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceActivityCreateInput, Prisma.WorkspaceActivityUncheckedCreateInput>;
};
export type WorkspaceActivityCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.WorkspaceActivityCreateManyInput | Prisma.WorkspaceActivityCreateManyInput[];
    skipDuplicates?: boolean;
};
export type WorkspaceActivityCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    data: Prisma.WorkspaceActivityCreateManyInput | Prisma.WorkspaceActivityCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.WorkspaceActivityIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceActivityUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceActivityUpdateInput, Prisma.WorkspaceActivityUncheckedUpdateInput>;
    where: Prisma.WorkspaceActivityWhereUniqueInput;
};
export type WorkspaceActivityUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.WorkspaceActivityUpdateManyMutationInput, Prisma.WorkspaceActivityUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceActivityWhereInput;
    limit?: number;
};
export type WorkspaceActivityUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.WorkspaceActivityUpdateManyMutationInput, Prisma.WorkspaceActivityUncheckedUpdateManyInput>;
    where?: Prisma.WorkspaceActivityWhereInput;
    limit?: number;
    include?: Prisma.WorkspaceActivityIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type WorkspaceActivityUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    where: Prisma.WorkspaceActivityWhereUniqueInput;
    create: Prisma.XOR<Prisma.WorkspaceActivityCreateInput, Prisma.WorkspaceActivityUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.WorkspaceActivityUpdateInput, Prisma.WorkspaceActivityUncheckedUpdateInput>;
};
export type WorkspaceActivityDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
    where: Prisma.WorkspaceActivityWhereUniqueInput;
};
export type WorkspaceActivityDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceActivityWhereInput;
    limit?: number;
};
export type WorkspaceActivityDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceActivitySelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceActivityOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceActivityInclude<ExtArgs> | null;
};
export {};
