import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ListModel = runtime.Types.Result.DefaultSelection<Prisma.$ListPayload>;
export type AggregateList = {
    _count: ListCountAggregateOutputType | null;
    _avg: ListAvgAggregateOutputType | null;
    _sum: ListSumAggregateOutputType | null;
    _min: ListMinAggregateOutputType | null;
    _max: ListMaxAggregateOutputType | null;
};
export type ListAvgAggregateOutputType = {
    id: number | null;
    boardId: number | null;
    position: number | null;
};
export type ListSumAggregateOutputType = {
    id: number | null;
    boardId: number | null;
    position: number | null;
};
export type ListMinAggregateOutputType = {
    id: number | null;
    boardId: number | null;
    name: string | null;
    position: number | null;
    colorPreset: $Enums.ListColorPreset | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ListMaxAggregateOutputType = {
    id: number | null;
    boardId: number | null;
    name: string | null;
    position: number | null;
    colorPreset: $Enums.ListColorPreset | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ListCountAggregateOutputType = {
    id: number;
    boardId: number;
    name: number;
    position: number;
    colorPreset: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ListAvgAggregateInputType = {
    id?: true;
    boardId?: true;
    position?: true;
};
export type ListSumAggregateInputType = {
    id?: true;
    boardId?: true;
    position?: true;
};
export type ListMinAggregateInputType = {
    id?: true;
    boardId?: true;
    name?: true;
    position?: true;
    colorPreset?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ListMaxAggregateInputType = {
    id?: true;
    boardId?: true;
    name?: true;
    position?: true;
    colorPreset?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ListCountAggregateInputType = {
    id?: true;
    boardId?: true;
    name?: true;
    position?: true;
    colorPreset?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ListAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListWhereInput;
    orderBy?: Prisma.ListOrderByWithRelationInput | Prisma.ListOrderByWithRelationInput[];
    cursor?: Prisma.ListWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ListCountAggregateInputType;
    _avg?: ListAvgAggregateInputType;
    _sum?: ListSumAggregateInputType;
    _min?: ListMinAggregateInputType;
    _max?: ListMaxAggregateInputType;
};
export type GetListAggregateType<T extends ListAggregateArgs> = {
    [P in keyof T & keyof AggregateList]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateList[P]> : Prisma.GetScalarType<T[P], AggregateList[P]>;
};
export type ListGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListWhereInput;
    orderBy?: Prisma.ListOrderByWithAggregationInput | Prisma.ListOrderByWithAggregationInput[];
    by: Prisma.ListScalarFieldEnum[] | Prisma.ListScalarFieldEnum;
    having?: Prisma.ListScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ListCountAggregateInputType | true;
    _avg?: ListAvgAggregateInputType;
    _sum?: ListSumAggregateInputType;
    _min?: ListMinAggregateInputType;
    _max?: ListMaxAggregateInputType;
};
export type ListGroupByOutputType = {
    id: number;
    boardId: number;
    name: string;
    position: number;
    colorPreset: $Enums.ListColorPreset;
    createdAt: Date;
    updatedAt: Date;
    _count: ListCountAggregateOutputType | null;
    _avg: ListAvgAggregateOutputType | null;
    _sum: ListSumAggregateOutputType | null;
    _min: ListMinAggregateOutputType | null;
    _max: ListMaxAggregateOutputType | null;
};
type GetListGroupByPayload<T extends ListGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ListGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ListGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ListGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ListGroupByOutputType[P]>;
}>>;
export type ListWhereInput = {
    AND?: Prisma.ListWhereInput | Prisma.ListWhereInput[];
    OR?: Prisma.ListWhereInput[];
    NOT?: Prisma.ListWhereInput | Prisma.ListWhereInput[];
    id?: Prisma.IntFilter<"List"> | number;
    boardId?: Prisma.IntFilter<"List"> | number;
    name?: Prisma.StringFilter<"List"> | string;
    position?: Prisma.IntFilter<"List"> | number;
    colorPreset?: Prisma.EnumListColorPresetFilter<"List"> | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFilter<"List"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"List"> | Date | string;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
    cards?: Prisma.CardListRelationFilter;
};
export type ListOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    colorPreset?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    board?: Prisma.BoardOrderByWithRelationInput;
    cards?: Prisma.CardOrderByRelationAggregateInput;
};
export type ListWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.ListWhereInput | Prisma.ListWhereInput[];
    OR?: Prisma.ListWhereInput[];
    NOT?: Prisma.ListWhereInput | Prisma.ListWhereInput[];
    boardId?: Prisma.IntFilter<"List"> | number;
    name?: Prisma.StringFilter<"List"> | string;
    position?: Prisma.IntFilter<"List"> | number;
    colorPreset?: Prisma.EnumListColorPresetFilter<"List"> | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFilter<"List"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"List"> | Date | string;
    board?: Prisma.XOR<Prisma.BoardScalarRelationFilter, Prisma.BoardWhereInput>;
    cards?: Prisma.CardListRelationFilter;
}, "id">;
export type ListOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    colorPreset?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ListCountOrderByAggregateInput;
    _avg?: Prisma.ListAvgOrderByAggregateInput;
    _max?: Prisma.ListMaxOrderByAggregateInput;
    _min?: Prisma.ListMinOrderByAggregateInput;
    _sum?: Prisma.ListSumOrderByAggregateInput;
};
export type ListScalarWhereWithAggregatesInput = {
    AND?: Prisma.ListScalarWhereWithAggregatesInput | Prisma.ListScalarWhereWithAggregatesInput[];
    OR?: Prisma.ListScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ListScalarWhereWithAggregatesInput | Prisma.ListScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"List"> | number;
    boardId?: Prisma.IntWithAggregatesFilter<"List"> | number;
    name?: Prisma.StringWithAggregatesFilter<"List"> | string;
    position?: Prisma.IntWithAggregatesFilter<"List"> | number;
    colorPreset?: Prisma.EnumListColorPresetWithAggregatesFilter<"List"> | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"List"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"List"> | Date | string;
};
export type ListCreateInput = {
    name: string;
    position?: number;
    colorPreset?: $Enums.ListColorPreset;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    board: Prisma.BoardCreateNestedOneWithoutListInput;
    cards?: Prisma.CardCreateNestedManyWithoutListInput;
};
export type ListUncheckedCreateInput = {
    id?: number;
    boardId: number;
    name: string;
    position?: number;
    colorPreset?: $Enums.ListColorPreset;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cards?: Prisma.CardUncheckedCreateNestedManyWithoutListInput;
};
export type ListUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    board?: Prisma.BoardUpdateOneRequiredWithoutListNestedInput;
    cards?: Prisma.CardUpdateManyWithoutListNestedInput;
};
export type ListUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    boardId?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cards?: Prisma.CardUncheckedUpdateManyWithoutListNestedInput;
};
export type ListCreateManyInput = {
    id?: number;
    boardId: number;
    name: string;
    position?: number;
    colorPreset?: $Enums.ListColorPreset;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ListUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    boardId?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListListRelationFilter = {
    every?: Prisma.ListWhereInput;
    some?: Prisma.ListWhereInput;
    none?: Prisma.ListWhereInput;
};
export type ListOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ListCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    colorPreset?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ListAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type ListMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    colorPreset?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ListMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    colorPreset?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ListSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    boardId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
};
export type ListScalarRelationFilter = {
    is?: Prisma.ListWhereInput;
    isNot?: Prisma.ListWhereInput;
};
export type ListCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput> | Prisma.ListCreateWithoutBoardInput[] | Prisma.ListUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutBoardInput | Prisma.ListCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.ListCreateManyBoardInputEnvelope;
    connect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
};
export type ListUncheckedCreateNestedManyWithoutBoardInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput> | Prisma.ListCreateWithoutBoardInput[] | Prisma.ListUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutBoardInput | Prisma.ListCreateOrConnectWithoutBoardInput[];
    createMany?: Prisma.ListCreateManyBoardInputEnvelope;
    connect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
};
export type ListUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput> | Prisma.ListCreateWithoutBoardInput[] | Prisma.ListUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutBoardInput | Prisma.ListCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.ListUpsertWithWhereUniqueWithoutBoardInput | Prisma.ListUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.ListCreateManyBoardInputEnvelope;
    set?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    disconnect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    delete?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    connect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    update?: Prisma.ListUpdateWithWhereUniqueWithoutBoardInput | Prisma.ListUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.ListUpdateManyWithWhereWithoutBoardInput | Prisma.ListUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.ListScalarWhereInput | Prisma.ListScalarWhereInput[];
};
export type ListUncheckedUpdateManyWithoutBoardNestedInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput> | Prisma.ListCreateWithoutBoardInput[] | Prisma.ListUncheckedCreateWithoutBoardInput[];
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutBoardInput | Prisma.ListCreateOrConnectWithoutBoardInput[];
    upsert?: Prisma.ListUpsertWithWhereUniqueWithoutBoardInput | Prisma.ListUpsertWithWhereUniqueWithoutBoardInput[];
    createMany?: Prisma.ListCreateManyBoardInputEnvelope;
    set?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    disconnect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    delete?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    connect?: Prisma.ListWhereUniqueInput | Prisma.ListWhereUniqueInput[];
    update?: Prisma.ListUpdateWithWhereUniqueWithoutBoardInput | Prisma.ListUpdateWithWhereUniqueWithoutBoardInput[];
    updateMany?: Prisma.ListUpdateManyWithWhereWithoutBoardInput | Prisma.ListUpdateManyWithWhereWithoutBoardInput[];
    deleteMany?: Prisma.ListScalarWhereInput | Prisma.ListScalarWhereInput[];
};
export type EnumListColorPresetFieldUpdateOperationsInput = {
    set?: $Enums.ListColorPreset;
};
export type ListCreateNestedOneWithoutCardsInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutCardsInput, Prisma.ListUncheckedCreateWithoutCardsInput>;
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutCardsInput;
    connect?: Prisma.ListWhereUniqueInput;
};
export type ListUpdateOneRequiredWithoutCardsNestedInput = {
    create?: Prisma.XOR<Prisma.ListCreateWithoutCardsInput, Prisma.ListUncheckedCreateWithoutCardsInput>;
    connectOrCreate?: Prisma.ListCreateOrConnectWithoutCardsInput;
    upsert?: Prisma.ListUpsertWithoutCardsInput;
    connect?: Prisma.ListWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ListUpdateToOneWithWhereWithoutCardsInput, Prisma.ListUpdateWithoutCardsInput>, Prisma.ListUncheckedUpdateWithoutCardsInput>;
};
export type ListCreateWithoutBoardInput = {
    name: string;
    position?: number;
    colorPreset?: $Enums.ListColorPreset;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cards?: Prisma.CardCreateNestedManyWithoutListInput;
};
export type ListUncheckedCreateWithoutBoardInput = {
    id?: number;
    name: string;
    position?: number;
    colorPreset?: $Enums.ListColorPreset;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    cards?: Prisma.CardUncheckedCreateNestedManyWithoutListInput;
};
export type ListCreateOrConnectWithoutBoardInput = {
    where: Prisma.ListWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput>;
};
export type ListCreateManyBoardInputEnvelope = {
    data: Prisma.ListCreateManyBoardInput | Prisma.ListCreateManyBoardInput[];
    skipDuplicates?: boolean;
};
export type ListUpsertWithWhereUniqueWithoutBoardInput = {
    where: Prisma.ListWhereUniqueInput;
    update: Prisma.XOR<Prisma.ListUpdateWithoutBoardInput, Prisma.ListUncheckedUpdateWithoutBoardInput>;
    create: Prisma.XOR<Prisma.ListCreateWithoutBoardInput, Prisma.ListUncheckedCreateWithoutBoardInput>;
};
export type ListUpdateWithWhereUniqueWithoutBoardInput = {
    where: Prisma.ListWhereUniqueInput;
    data: Prisma.XOR<Prisma.ListUpdateWithoutBoardInput, Prisma.ListUncheckedUpdateWithoutBoardInput>;
};
export type ListUpdateManyWithWhereWithoutBoardInput = {
    where: Prisma.ListScalarWhereInput;
    data: Prisma.XOR<Prisma.ListUpdateManyMutationInput, Prisma.ListUncheckedUpdateManyWithoutBoardInput>;
};
export type ListScalarWhereInput = {
    AND?: Prisma.ListScalarWhereInput | Prisma.ListScalarWhereInput[];
    OR?: Prisma.ListScalarWhereInput[];
    NOT?: Prisma.ListScalarWhereInput | Prisma.ListScalarWhereInput[];
    id?: Prisma.IntFilter<"List"> | number;
    boardId?: Prisma.IntFilter<"List"> | number;
    name?: Prisma.StringFilter<"List"> | string;
    position?: Prisma.IntFilter<"List"> | number;
    colorPreset?: Prisma.EnumListColorPresetFilter<"List"> | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFilter<"List"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"List"> | Date | string;
};
export type ListCreateWithoutCardsInput = {
    name: string;
    position?: number;
    colorPreset?: $Enums.ListColorPreset;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    board: Prisma.BoardCreateNestedOneWithoutListInput;
};
export type ListUncheckedCreateWithoutCardsInput = {
    id?: number;
    boardId: number;
    name: string;
    position?: number;
    colorPreset?: $Enums.ListColorPreset;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ListCreateOrConnectWithoutCardsInput = {
    where: Prisma.ListWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListCreateWithoutCardsInput, Prisma.ListUncheckedCreateWithoutCardsInput>;
};
export type ListUpsertWithoutCardsInput = {
    update: Prisma.XOR<Prisma.ListUpdateWithoutCardsInput, Prisma.ListUncheckedUpdateWithoutCardsInput>;
    create: Prisma.XOR<Prisma.ListCreateWithoutCardsInput, Prisma.ListUncheckedCreateWithoutCardsInput>;
    where?: Prisma.ListWhereInput;
};
export type ListUpdateToOneWithWhereWithoutCardsInput = {
    where?: Prisma.ListWhereInput;
    data: Prisma.XOR<Prisma.ListUpdateWithoutCardsInput, Prisma.ListUncheckedUpdateWithoutCardsInput>;
};
export type ListUpdateWithoutCardsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    board?: Prisma.BoardUpdateOneRequiredWithoutListNestedInput;
};
export type ListUncheckedUpdateWithoutCardsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    boardId?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListCreateManyBoardInput = {
    id?: number;
    name: string;
    position?: number;
    colorPreset?: $Enums.ListColorPreset;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ListUpdateWithoutBoardInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cards?: Prisma.CardUpdateManyWithoutListNestedInput;
};
export type ListUncheckedUpdateWithoutBoardInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    cards?: Prisma.CardUncheckedUpdateManyWithoutListNestedInput;
};
export type ListUncheckedUpdateManyWithoutBoardInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    position?: Prisma.IntFieldUpdateOperationsInput | number;
    colorPreset?: Prisma.EnumListColorPresetFieldUpdateOperationsInput | $Enums.ListColorPreset;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ListCountOutputType = {
    cards: number;
};
export type ListCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    cards?: boolean | ListCountOutputTypeCountCardsArgs;
};
export type ListCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListCountOutputTypeSelect<ExtArgs> | null;
};
export type ListCountOutputTypeCountCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardWhereInput;
};
export type ListSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    name?: boolean;
    position?: boolean;
    colorPreset?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    cards?: boolean | Prisma.List$cardsArgs<ExtArgs>;
    _count?: boolean | Prisma.ListCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["list"]>;
export type ListSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    name?: boolean;
    position?: boolean;
    colorPreset?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["list"]>;
export type ListSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    boardId?: boolean;
    name?: boolean;
    position?: boolean;
    colorPreset?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["list"]>;
export type ListSelectScalar = {
    id?: boolean;
    boardId?: boolean;
    name?: boolean;
    position?: boolean;
    colorPreset?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ListOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "boardId" | "name" | "position" | "colorPreset" | "createdAt" | "updatedAt", ExtArgs["result"]["list"]>;
export type ListInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
    cards?: boolean | Prisma.List$cardsArgs<ExtArgs>;
    _count?: boolean | Prisma.ListCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ListIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type ListIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    board?: boolean | Prisma.BoardDefaultArgs<ExtArgs>;
};
export type $ListPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "List";
    objects: {
        board: Prisma.$BoardPayload<ExtArgs>;
        cards: Prisma.$CardPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        boardId: number;
        name: string;
        position: number;
        colorPreset: $Enums.ListColorPreset;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["list"]>;
    composites: {};
};
export type ListGetPayload<S extends boolean | null | undefined | ListDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ListPayload, S>;
export type ListCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ListFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ListCountAggregateInputType | true;
};
export interface ListDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['List'];
        meta: {
            name: 'List';
        };
    };
    findUnique<T extends ListFindUniqueArgs>(args: Prisma.SelectSubset<T, ListFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ListFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ListFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ListFindFirstArgs>(args?: Prisma.SelectSubset<T, ListFindFirstArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ListFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ListFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ListFindManyArgs>(args?: Prisma.SelectSubset<T, ListFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ListCreateArgs>(args: Prisma.SelectSubset<T, ListCreateArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ListCreateManyArgs>(args?: Prisma.SelectSubset<T, ListCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ListCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ListCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ListDeleteArgs>(args: Prisma.SelectSubset<T, ListDeleteArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ListUpdateArgs>(args: Prisma.SelectSubset<T, ListUpdateArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ListDeleteManyArgs>(args?: Prisma.SelectSubset<T, ListDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ListUpdateManyArgs>(args: Prisma.SelectSubset<T, ListUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ListUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ListUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ListUpsertArgs>(args: Prisma.SelectSubset<T, ListUpsertArgs<ExtArgs>>): Prisma.Prisma__ListClient<runtime.Types.Result.GetResult<Prisma.$ListPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ListCountArgs>(args?: Prisma.Subset<T, ListCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ListCountAggregateOutputType> : number>;
    aggregate<T extends ListAggregateArgs>(args: Prisma.Subset<T, ListAggregateArgs>): Prisma.PrismaPromise<GetListAggregateType<T>>;
    groupBy<T extends ListGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ListGroupByArgs['orderBy'];
    } : {
        orderBy?: ListGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ListGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetListGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ListFieldRefs;
}
export interface Prisma__ListClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    board<T extends Prisma.BoardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BoardDefaultArgs<ExtArgs>>): Prisma.Prisma__BoardClient<runtime.Types.Result.GetResult<Prisma.$BoardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    cards<T extends Prisma.List$cardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.List$cardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ListFieldRefs {
    readonly id: Prisma.FieldRef<"List", 'Int'>;
    readonly boardId: Prisma.FieldRef<"List", 'Int'>;
    readonly name: Prisma.FieldRef<"List", 'String'>;
    readonly position: Prisma.FieldRef<"List", 'Int'>;
    readonly colorPreset: Prisma.FieldRef<"List", 'ListColorPreset'>;
    readonly createdAt: Prisma.FieldRef<"List", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"List", 'DateTime'>;
}
export type ListFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where: Prisma.ListWhereUniqueInput;
};
export type ListFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where: Prisma.ListWhereUniqueInput;
};
export type ListFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ListFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ListFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type ListCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListCreateInput, Prisma.ListUncheckedCreateInput>;
};
export type ListCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ListCreateManyInput | Prisma.ListCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ListCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    data: Prisma.ListCreateManyInput | Prisma.ListCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ListIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ListUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListUpdateInput, Prisma.ListUncheckedUpdateInput>;
    where: Prisma.ListWhereUniqueInput;
};
export type ListUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ListUpdateManyMutationInput, Prisma.ListUncheckedUpdateManyInput>;
    where?: Prisma.ListWhereInput;
    limit?: number;
};
export type ListUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ListUpdateManyMutationInput, Prisma.ListUncheckedUpdateManyInput>;
    where?: Prisma.ListWhereInput;
    limit?: number;
    include?: Prisma.ListIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ListUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where: Prisma.ListWhereUniqueInput;
    create: Prisma.XOR<Prisma.ListCreateInput, Prisma.ListUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ListUpdateInput, Prisma.ListUncheckedUpdateInput>;
};
export type ListDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
    where: Prisma.ListWhereUniqueInput;
};
export type ListDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ListWhereInput;
    limit?: number;
};
export type List$cardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CardSelect<ExtArgs> | null;
    omit?: Prisma.CardOmit<ExtArgs> | null;
    include?: Prisma.CardInclude<ExtArgs> | null;
    where?: Prisma.CardWhereInput;
    orderBy?: Prisma.CardOrderByWithRelationInput | Prisma.CardOrderByWithRelationInput[];
    cursor?: Prisma.CardWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CardScalarFieldEnum | Prisma.CardScalarFieldEnum[];
};
export type ListDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ListSelect<ExtArgs> | null;
    omit?: Prisma.ListOmit<ExtArgs> | null;
    include?: Prisma.ListInclude<ExtArgs> | null;
};
export {};
