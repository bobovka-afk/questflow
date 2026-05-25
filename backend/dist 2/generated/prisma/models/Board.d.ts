import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BoardModel = runtime.Types.Result.DefaultSelection<Prisma.$BoardPayload>;
export type AggregateBoard = {
    _count: BoardCountAggregateOutputType | null;
    _avg: BoardAvgAggregateOutputType | null;
    _sum: BoardSumAggregateOutputType | null;
    _min: BoardMinAggregateOutputType | null;
    _max: BoardMaxAggregateOutputType | null;
};
export type BoardAvgAggregateOutputType = {
    id: number | null;
    workspaceId: number | null;
    position: number | null;
};
export type BoardSumAggregateOutputType = {
    id: number | null;
    workspaceId: number | null;
    position: number | null;
};
export type BoardMinAggregateOutputType = {
    id: number | null;
    workspaceId: number | null;
    name: string | null;
    description: string | null;
    position: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardMaxAggregateOutputType = {
    id: number | null;
    workspaceId: number | null;
    name: string | null;
    description: string | null;
    position: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BoardCountAggregateOutputType = {
    id: number;
    workspaceId: number;
    name: number;
    description: number;
    position: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BoardAvgAggregateInputType = {
    id?: true;
    workspaceId?: true;
    position?: true;
};
export type BoardSumAggregateInputType = {
    id?: true;
    workspaceId?: true;
    position?: true;
};
export type BoardMinAggregateInputType = {
    id?: true;
    workspaceId?: true;
    name?: true;
    description?: true;
    position?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardMaxAggregateInputType = {
    id?: true;
    workspaceId?: true;
    name?: true;
    description?: true;
    position?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BoardCountAggregateInputType = {
    id?: true;
    workspaceId?: true;
    name?: true;
    description?: true;
    position?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BoardAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BoardCountAggregateInputType;
    _avg?: BoardAvgAggregateInputType;
    _sum?: BoardSumAggregateInputType;
    _min?: BoardMinAggregateInputType;
    _max?: BoardMaxAggregateInputType;
};
export type GetBoardAggregateType<T extends BoardAggregateArgs> = {
    [P in keyof T & keyof AggregateBoard]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBoard[P]> : Prisma.GetScalarType<T[P], AggregateBoard[P]>;
};
export type BoardGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithAggregationInput | Prisma.BoardOrderByWithAggregationInput[];
    by: Prisma.BoardScalarFieldEnum[] | Prisma.BoardScalarFieldEnum;
    having?: Prisma.BoardScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BoardCountAggregateInputType | true;
    _avg?: BoardAvgAggregateInputType;
    _sum?: BoardSumAggregateInputType;
    _min?: BoardMinAggregateInputType;
    _max?: BoardMaxAggregateInputType;
};
export type BoardGroupByOutputType = {
    id: number;
    workspaceId: number;
    name: string;
    description: string | null;
    position: number;
    createdAt: Date;
    updatedAt: Date;
    _count: BoardCountAggregateOutputType | null;
    _avg: BoardAvgAggregateOutputType | null;
    _sum: BoardSumAggregateOutputType | null;
    _min: BoardMinAggregateOutputType | null;
    _max: BoardMaxAggregateOutputType | null;
};
type GetBoardGroupByPayload<T extends BoardGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BoardGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BoardGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BoardGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BoardGroupByOutputType[P]>;
}>>;
export type BoardWhereInput = {
    AND?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    OR?: Prisma.BoardWhereInput[];
    NOT?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    id?: Prisma.IntFilter<"Board"> | number;
    workspaceId?: Prisma.IntFilter<"Board"> | number;
    name?: Prisma.StringFilter<"Board"> | string;
    description?: Prisma.StringNullableFilter<"Board"> | string | null;
    position?: Prisma.IntFilter<"Board"> | number;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    list?: Prisma.ListListRelationFilter;
};
export type BoardOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    position?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    workspace?: Prisma.WorkspaceOrderByWithRelationInput;
    list?: Prisma.ListOrderByRelationAggregateInput;
};
export type BoardWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    OR?: Prisma.BoardWhereInput[];
    NOT?: Prisma.BoardWhereInput | Prisma.BoardWhereInput[];
    workspaceId?: Prisma.IntFilter<"Board"> | number;
    name?: Prisma.StringFilter<"Board"> | string;
    description?: Prisma.StringNullableFilter<"Board"> | string | null;
    position?: Prisma.IntFilter<"Board"> | number;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    workspace?: Prisma.XOR<Prisma.WorkspaceScalarRelationFilter, Prisma.WorkspaceWhereInput>;
    list?: Prisma.ListListRelationFilter;
}, "id">;
export type BoardOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    position?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BoardCountOrderByAggregateInput;
    _avg?: Prisma.BoardAvgOrderByAggregateInput;
    _max?: Prisma.BoardMaxOrderByAggregateInput;
    _min?: Prisma.BoardMinOrderByAggregateInput;
    _sum?: Prisma.BoardSumOrderByAggregateInput;
};
export type BoardScalarWhereWithAggregatesInput = {
    AND?: Prisma.BoardScalarWhereWithAggregatesInput | Prisma.BoardScalarWhereWithAggregatesInput[];
    OR?: Prisma.BoardScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BoardScalarWhereWithAggregatesInput | Prisma.BoardScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Board"> | number;
    workspaceId?: Prisma.IntWithAggregatesFilter<"Board"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Board"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Board"> | string | null;
    position?: Prisma.IntWithAggregatesFilter<"Board"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Board"> | Date | string;
};
export type BoardCreateInput = {
    name: string;
    description?: string | null;
    position?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutBoardsInput;
    list?: Prisma.ListCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateInput = {
    id?: number;
    workspaceId: number;
    name: string;
    description?: string | null;
    position?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    list?: Prisma.ListUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutBoardsNestedInput;
    list?: Prisma.ListUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    workspaceId?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    list?: Prisma.ListUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardCreateManyInput = {
    id?: number;
    workspaceId: number;
    name: string;
    description?: string | null;
    position?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    workspaceId?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardListRelationFilter = {
    every?: Prisma.BoardWhereInput;
    some?: Prisma.BoardWhereInput;
    none?: Prisma.BoardWhereInput;
};
export type BoardOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BoardCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type BoardMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BoardSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    workspaceId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type BoardScalarRelationFilter = {
    is?: Prisma.BoardWhereInput;
    isNot?: Prisma.BoardWhereInput;
};
export type BoardCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput> | Prisma.BoardCreateWithoutWorkspaceInput[] | Prisma.BoardUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutWorkspaceInput | Prisma.BoardCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.BoardCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
};
export type BoardUncheckedCreateNestedManyWithoutWorkspaceInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput> | Prisma.BoardCreateWithoutWorkspaceInput[] | Prisma.BoardUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutWorkspaceInput | Prisma.BoardCreateOrConnectWithoutWorkspaceInput[];
    createMany?: Prisma.BoardCreateManyWorkspaceInputEnvelope;
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
};
export type BoardUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput> | Prisma.BoardCreateWithoutWorkspaceInput[] | Prisma.BoardUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutWorkspaceInput | Prisma.BoardCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.BoardUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.BoardUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.BoardCreateManyWorkspaceInputEnvelope;
    set?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    disconnect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    delete?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    update?: Prisma.BoardUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.BoardUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.BoardUpdateManyWithWhereWithoutWorkspaceInput | Prisma.BoardUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
};
export type BoardUncheckedUpdateManyWithoutWorkspaceNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput> | Prisma.BoardCreateWithoutWorkspaceInput[] | Prisma.BoardUncheckedCreateWithoutWorkspaceInput[];
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutWorkspaceInput | Prisma.BoardCreateOrConnectWithoutWorkspaceInput[];
    upsert?: Prisma.BoardUpsertWithWhereUniqueWithoutWorkspaceInput | Prisma.BoardUpsertWithWhereUniqueWithoutWorkspaceInput[];
    createMany?: Prisma.BoardCreateManyWorkspaceInputEnvelope;
    set?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    disconnect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    delete?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    connect?: Prisma.BoardWhereUniqueInput | Prisma.BoardWhereUniqueInput[];
    update?: Prisma.BoardUpdateWithWhereUniqueWithoutWorkspaceInput | Prisma.BoardUpdateWithWhereUniqueWithoutWorkspaceInput[];
    updateMany?: Prisma.BoardUpdateManyWithWhereWithoutWorkspaceInput | Prisma.BoardUpdateManyWithWhereWithoutWorkspaceInput[];
    deleteMany?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
};
export type BoardCreateNestedOneWithoutListInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutListInput, Prisma.BoardUncheckedCreateWithoutListInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutListInput;
    connect?: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateOneRequiredWithoutListNestedInput = {
    create?: Prisma.XOR<Prisma.BoardCreateWithoutListInput, Prisma.BoardUncheckedCreateWithoutListInput>;
    connectOrCreate?: Prisma.BoardCreateOrConnectWithoutListInput;
    upsert?: Prisma.BoardUpsertWithoutListInput;
    connect?: Prisma.BoardWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BoardUpdateToOneWithWhereWithoutListInput, Prisma.BoardUpdateWithoutListInput>, Prisma.BoardUncheckedUpdateWithoutListInput>;
};
export type BoardCreateWithoutWorkspaceInput = {
    name: string;
    description?: string | null;
    position?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    list?: Prisma.ListCreateNestedManyWithoutBoardInput;
};
export type BoardUncheckedCreateWithoutWorkspaceInput = {
    id?: number;
    name: string;
    description?: string | null;
    position?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    list?: Prisma.ListUncheckedCreateNestedManyWithoutBoardInput;
};
export type BoardCreateOrConnectWithoutWorkspaceInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput>;
};
export type BoardCreateManyWorkspaceInputEnvelope = {
    data: Prisma.BoardCreateManyWorkspaceInput | Prisma.BoardCreateManyWorkspaceInput[];
    skipDuplicates?: boolean;
};
export type BoardUpsertWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.BoardWhereUniqueInput;
    update: Prisma.XOR<Prisma.BoardUpdateWithoutWorkspaceInput, Prisma.BoardUncheckedUpdateWithoutWorkspaceInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutWorkspaceInput, Prisma.BoardUncheckedCreateWithoutWorkspaceInput>;
};
export type BoardUpdateWithWhereUniqueWithoutWorkspaceInput = {
    where: Prisma.BoardWhereUniqueInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutWorkspaceInput, Prisma.BoardUncheckedUpdateWithoutWorkspaceInput>;
};
export type BoardUpdateManyWithWhereWithoutWorkspaceInput = {
    where: Prisma.BoardScalarWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyWithoutWorkspaceInput>;
};
export type BoardScalarWhereInput = {
    AND?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
    OR?: Prisma.BoardScalarWhereInput[];
    NOT?: Prisma.BoardScalarWhereInput | Prisma.BoardScalarWhereInput[];
    id?: Prisma.IntFilter<"Board"> | number;
    workspaceId?: Prisma.IntFilter<"Board"> | number;
    name?: Prisma.StringFilter<"Board"> | string;
    description?: Prisma.StringNullableFilter<"Board"> | string | null;
    position?: Prisma.IntFilter<"Board"> | number;
    createdAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Board"> | Date | string;
};
export type BoardCreateWithoutListInput = {
    name: string;
    description?: string | null;
    position?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspace: Prisma.WorkspaceCreateNestedOneWithoutBoardsInput;
};
export type BoardUncheckedCreateWithoutListInput = {
    id?: number;
    workspaceId: number;
    name: string;
    description?: string | null;
    position?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardCreateOrConnectWithoutListInput = {
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateWithoutListInput, Prisma.BoardUncheckedCreateWithoutListInput>;
};
export type BoardUpsertWithoutListInput = {
    update: Prisma.XOR<Prisma.BoardUpdateWithoutListInput, Prisma.BoardUncheckedUpdateWithoutListInput>;
    create: Prisma.XOR<Prisma.BoardCreateWithoutListInput, Prisma.BoardUncheckedCreateWithoutListInput>;
    where?: Prisma.BoardWhereInput;
};
export type BoardUpdateToOneWithWhereWithoutListInput = {
    where?: Prisma.BoardWhereInput;
    data: Prisma.XOR<Prisma.BoardUpdateWithoutListInput, Prisma.BoardUncheckedUpdateWithoutListInput>;
};
export type BoardUpdateWithoutListInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspace?: Prisma.WorkspaceUpdateOneRequiredWithoutBoardsNestedInput;
};
export type BoardUncheckedUpdateWithoutListInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    workspaceId?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardCreateManyWorkspaceInput = {
    id?: number;
    name: string;
    description?: string | null;
    position?: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BoardUpdateWithoutWorkspaceInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    list?: Prisma.ListUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateWithoutWorkspaceInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    list?: Prisma.ListUncheckedUpdateManyWithoutBoardNestedInput;
};
export type BoardUncheckedUpdateManyWithoutWorkspaceInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BoardCountOutputType = {
    list: number;
};
export type BoardCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    list?: boolean | BoardCountOutputTypeCountListArgs;
};
export type BoardCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardCountOutputTypeSelect<ExtArgs> | null;
};
export type BoardCountOutputTypeCountListArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListWhereInput;
};
export type BoardSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    name?: boolean;
    description?: boolean;
    position?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    list?: boolean | Prisma.Board$listArgs<ExtArgs>;
    _count?: boolean | Prisma.BoardCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    name?: boolean;
    description?: boolean;
    position?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    workspaceId?: boolean;
    name?: boolean;
    description?: boolean;
    position?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["board"]>;
export type BoardSelectScalar = {
    id?: boolean;
    workspaceId?: boolean;
    name?: boolean;
    description?: boolean;
    position?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BoardOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "workspaceId" | "name" | "description" | "position" | "createdAt" | "updatedAt", ExtArgs["result"]["board"]>;
export type BoardInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
    list?: boolean | Prisma.Board$listArgs<ExtArgs>;
    _count?: boolean | Prisma.BoardCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BoardIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type BoardIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    workspace?: boolean | Prisma.WorkspaceDefaultArgs<ExtArgs>;
};
export type $BoardPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Board";
    objects: {
        workspace: Prisma.$WorkspacePayload<ExtArgs>;
        list: Prisma.$ListPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        workspaceId: number;
        name: string;
        description: string | null;
        position: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["board"]>;
    composites: {};
};
export type BoardGetPayload<S extends boolean | null | undefined | BoardDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BoardPayload, S>;
export type BoardCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BoardFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BoardCountAggregateInputType | true;
};
export interface BoardDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Board'];
        meta: {
            name: 'Board';
        };
    };
    findUnique<T extends BoardFindUniqueArgs>(args: Prisma.SelectSubset<T, BoardFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BoardFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BoardFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BoardFindFirstArgs>(args?: Prisma.SelectSubset<T, BoardFindFirstArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BoardFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BoardFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BoardFindManyArgs>(args?: Prisma.SelectSubset<T, BoardFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BoardCreateArgs>(args: Prisma.SelectSubset<T, BoardCreateArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BoardCreateManyArgs>(args?: Prisma.SelectSubset<T, BoardCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BoardCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BoardCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BoardDeleteArgs>(args: Prisma.SelectSubset<T, BoardDeleteArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BoardUpdateArgs>(args: Prisma.SelectSubset<T, BoardUpdateArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BoardDeleteManyArgs>(args?: Prisma.SelectSubset<T, BoardDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BoardUpdateManyArgs>(args: Prisma.SelectSubset<T, BoardUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BoardUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BoardUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BoardUpsertArgs>(args: Prisma.SelectSubset<T, BoardUpsertArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BoardCountArgs>(args?: Prisma.Subset<T, BoardCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BoardCountAggregateOutputType> : number>;
    aggregate<T extends BoardAggregateArgs>(args: Prisma.Subset<T, BoardAggregateArgs>): Prisma.PrismaPromise<GetBoardAggregateType<T>>;
    groupBy<T extends BoardGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BoardGroupByArgs['orderBy'];
    } : {
        orderBy?: BoardGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BoardGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBoardGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BoardFieldRefs;
}
export interface Prisma__BoardClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    workspace<T extends Prisma.WorkspaceDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.WorkspaceDefaultArgs<ExtArgs>>): Prisma.Prisma__WorkspaceClient<runtime.Types.Result.GetResult<Prisma.$WorkspacePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    list<T extends Prisma.Board$listArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Board$listArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BoardFieldRefs {
    readonly id: Prisma.FieldRef<"Board", 'Int'>;
    readonly workspaceId: Prisma.FieldRef<"Board", 'Int'>;
    readonly name: Prisma.FieldRef<"Board", 'String'>;
    readonly description: Prisma.FieldRef<"Board", 'String'>;
    readonly position: Prisma.FieldRef<"Board", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"Board", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Board", 'DateTime'>;
}
export type BoardFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardScalarFieldEnum | Prisma.BoardScalarFieldEnum[];
};
export type BoardFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardScalarFieldEnum | Prisma.BoardScalarFieldEnum[];
};
export type BoardFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where?: Prisma.BoardWhereInput;
    orderBy?: Prisma.BoardOrderByWithRelationInput | Prisma.BoardOrderByWithRelationInput[];
    cursor?: Prisma.BoardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BoardScalarFieldEnum | Prisma.BoardScalarFieldEnum[];
};
export type BoardCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardCreateInput, Prisma.BoardUncheckedCreateInput>;
};
export type BoardCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BoardCreateManyInput | Prisma.BoardCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BoardCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    data: Prisma.BoardCreateManyInput | Prisma.BoardCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BoardIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BoardUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardUpdateInput, Prisma.BoardUncheckedUpdateInput>;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyInput>;
    where?: Prisma.BoardWhereInput;
    limit?: number;
};
export type BoardUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BoardUpdateManyMutationInput, Prisma.BoardUncheckedUpdateManyInput>;
    where?: Prisma.BoardWhereInput;
    limit?: number;
    include?: Prisma.BoardIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BoardUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
    create: Prisma.XOR<Prisma.BoardCreateInput, Prisma.BoardUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BoardUpdateInput, Prisma.BoardUncheckedUpdateInput>;
};
export type BoardDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
    where: Prisma.BoardWhereUniqueInput;
};
export type BoardDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BoardWhereInput;
    limit?: number;
};
export type Board$listArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where?: Prisma.ListWhereInput;
    orderBy?: Prisma.ListOrderByWithRelationInput | Prisma.ListOrderByWithRelationInput[];
    cursor?: Prisma.ListWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ListScalarFieldEnum | Prisma.ListScalarFieldEnum[];
};
export type BoardDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BoardSelect<ExtArgs> | null;
    omit?: Prisma.BoardOmit<ExtArgs> | null;
    include?: Prisma.BoardInclude<ExtArgs> | null;
};
export {};
