import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CommentModel = runtime.Types.Result.DefaultSelection<Prisma.$CommentPayload>;
export type AggregateComment = {
    _count: CommentCountAggregateOutputType | null;
    _avg: CommentAvgAggregateOutputType | null;
    _sum: CommentSumAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
};
export type CommentAvgAggregateOutputType = {
    id: number | null;
    cardId: number | null;
    userId: number | null;
};
export type CommentSumAggregateOutputType = {
    id: number | null;
    cardId: number | null;
    userId: number | null;
};
export type CommentMinAggregateOutputType = {
    id: number | null;
    cardId: number | null;
    userId: number | null;
    body: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CommentMaxAggregateOutputType = {
    id: number | null;
    cardId: number | null;
    userId: number | null;
    body: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CommentCountAggregateOutputType = {
    id: number;
    cardId: number;
    userId: number;
    body: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CommentAvgAggregateInputType = {
    id?: true;
    cardId?: true;
    userId?: true;
};
export type CommentSumAggregateInputType = {
    id?: true;
    cardId?: true;
    userId?: true;
};
export type CommentMinAggregateInputType = {
    id?: true;
    cardId?: true;
    userId?: true;
    body?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CommentMaxAggregateInputType = {
    id?: true;
    cardId?: true;
    userId?: true;
    body?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CommentCountAggregateInputType = {
    id?: true;
    cardId?: true;
    userId?: true;
    body?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CommentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CommentCountAggregateInputType;
    _avg?: CommentAvgAggregateInputType;
    _sum?: CommentSumAggregateInputType;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
};
export type GetCommentAggregateType<T extends CommentAggregateArgs> = {
    [P in keyof T & keyof AggregateComment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateComment[P]> : Prisma.GetScalarType<T[P], AggregateComment[P]>;
};
export type CommentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithAggregationInput | Prisma.CommentOrderByWithAggregationInput[];
    by: Prisma.CommentScalarFieldEnum[] | Prisma.CommentScalarFieldEnum;
    having?: Prisma.CommentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CommentCountAggregateInputType | true;
    _avg?: CommentAvgAggregateInputType;
    _sum?: CommentSumAggregateInputType;
    _min?: CommentMinAggregateInputType;
    _max?: CommentMaxAggregateInputType;
};
export type CommentGroupByOutputType = {
    id: number;
    cardId: number;
    userId: number;
    body: string;
    createdAt: Date;
    updatedAt: Date;
    _count: CommentCountAggregateOutputType | null;
    _avg: CommentAvgAggregateOutputType | null;
    _sum: CommentSumAggregateOutputType | null;
    _min: CommentMinAggregateOutputType | null;
    _max: CommentMaxAggregateOutputType | null;
};
type GetCommentGroupByPayload<T extends CommentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CommentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CommentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CommentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CommentGroupByOutputType[P]>;
}>>;
export type CommentWhereInput = {
    AND?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    OR?: Prisma.CommentWhereInput[];
    NOT?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    id?: Prisma.IntFilter<"Comment"> | number;
    cardId?: Prisma.IntFilter<"Comment"> | number;
    userId?: Prisma.IntFilter<"Comment"> | number;
    body?: Prisma.StringFilter<"Comment"> | string;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    card?: Prisma.XOR<Prisma.CardScalarRelationFilter, Prisma.CardWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type CommentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    card?: Prisma.CardOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type CommentWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    OR?: Prisma.CommentWhereInput[];
    NOT?: Prisma.CommentWhereInput | Prisma.CommentWhereInput[];
    cardId?: Prisma.IntFilter<"Comment"> | number;
    userId?: Prisma.IntFilter<"Comment"> | number;
    body?: Prisma.StringFilter<"Comment"> | string;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    card?: Prisma.XOR<Prisma.CardScalarRelationFilter, Prisma.CardWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type CommentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CommentCountOrderByAggregateInput;
    _avg?: Prisma.CommentAvgOrderByAggregateInput;
    _max?: Prisma.CommentMaxOrderByAggregateInput;
    _min?: Prisma.CommentMinOrderByAggregateInput;
    _sum?: Prisma.CommentSumOrderByAggregateInput;
};
export type CommentScalarWhereWithAggregatesInput = {
    AND?: Prisma.CommentScalarWhereWithAggregatesInput | Prisma.CommentScalarWhereWithAggregatesInput[];
    OR?: Prisma.CommentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CommentScalarWhereWithAggregatesInput | Prisma.CommentScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Comment"> | number;
    cardId?: Prisma.IntWithAggregatesFilter<"Comment"> | number;
    userId?: Prisma.IntWithAggregatesFilter<"Comment"> | number;
    body?: Prisma.StringWithAggregatesFilter<"Comment"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Comment"> | Date | string;
};
export type CommentCreateInput = {
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    card: Prisma.CardCreateNestedOneWithoutCommentsInput;
    user: Prisma.UserCreateNestedOneWithoutCommentsInput;
};
export type CommentUncheckedCreateInput = {
    id?: number;
    cardId: number;
    userId: number;
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentUpdateInput = {
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.CardUpdateOneRequiredWithoutCommentsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
};
export type CommentUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    cardId?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentCreateManyInput = {
    id?: number;
    cardId: number;
    userId: number;
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentUpdateManyMutationInput = {
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    cardId?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentListRelationFilter = {
    every?: Prisma.CommentWhereInput;
    some?: Prisma.CommentWhereInput;
    none?: Prisma.CommentWhereInput;
};
export type CommentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CommentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CommentAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type CommentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CommentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CommentSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    cardId?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
};
export type CommentCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput> | Prisma.CommentCreateWithoutUserInput[] | Prisma.CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutUserInput | Prisma.CommentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CommentCreateManyUserInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput> | Prisma.CommentCreateWithoutUserInput[] | Prisma.CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutUserInput | Prisma.CommentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.CommentCreateManyUserInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput> | Prisma.CommentCreateWithoutUserInput[] | Prisma.CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutUserInput | Prisma.CommentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutUserInput | Prisma.CommentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CommentCreateManyUserInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutUserInput | Prisma.CommentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutUserInput | Prisma.CommentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput> | Prisma.CommentCreateWithoutUserInput[] | Prisma.CommentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutUserInput | Prisma.CommentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutUserInput | Prisma.CommentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.CommentCreateManyUserInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutUserInput | Prisma.CommentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutUserInput | Prisma.CommentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutCardInput, Prisma.CommentUncheckedCreateWithoutCardInput> | Prisma.CommentCreateWithoutCardInput[] | Prisma.CommentUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutCardInput | Prisma.CommentCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.CommentCreateManyCardInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUncheckedCreateNestedManyWithoutCardInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutCardInput, Prisma.CommentUncheckedCreateWithoutCardInput> | Prisma.CommentCreateWithoutCardInput[] | Prisma.CommentUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutCardInput | Prisma.CommentCreateOrConnectWithoutCardInput[];
    createMany?: Prisma.CommentCreateManyCardInputEnvelope;
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
};
export type CommentUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutCardInput, Prisma.CommentUncheckedCreateWithoutCardInput> | Prisma.CommentCreateWithoutCardInput[] | Prisma.CommentUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutCardInput | Prisma.CommentCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutCardInput | Prisma.CommentUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.CommentCreateManyCardInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutCardInput | Prisma.CommentUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutCardInput | Prisma.CommentUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentUncheckedUpdateManyWithoutCardNestedInput = {
    create?: Prisma.XOR<Prisma.CommentCreateWithoutCardInput, Prisma.CommentUncheckedCreateWithoutCardInput> | Prisma.CommentCreateWithoutCardInput[] | Prisma.CommentUncheckedCreateWithoutCardInput[];
    connectOrCreate?: Prisma.CommentCreateOrConnectWithoutCardInput | Prisma.CommentCreateOrConnectWithoutCardInput[];
    upsert?: Prisma.CommentUpsertWithWhereUniqueWithoutCardInput | Prisma.CommentUpsertWithWhereUniqueWithoutCardInput[];
    createMany?: Prisma.CommentCreateManyCardInputEnvelope;
    set?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    disconnect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    delete?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    connect?: Prisma.CommentWhereUniqueInput | Prisma.CommentWhereUniqueInput[];
    update?: Prisma.CommentUpdateWithWhereUniqueWithoutCardInput | Prisma.CommentUpdateWithWhereUniqueWithoutCardInput[];
    updateMany?: Prisma.CommentUpdateManyWithWhereWithoutCardInput | Prisma.CommentUpdateManyWithWhereWithoutCardInput[];
    deleteMany?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
};
export type CommentCreateWithoutUserInput = {
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    card: Prisma.CardCreateNestedOneWithoutCommentsInput;
};
export type CommentUncheckedCreateWithoutUserInput = {
    id?: number;
    cardId: number;
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentCreateOrConnectWithoutUserInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput>;
};
export type CommentCreateManyUserInputEnvelope = {
    data: Prisma.CommentCreateManyUserInput | Prisma.CommentCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutUserInput, Prisma.CommentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutUserInput, Prisma.CommentUncheckedCreateWithoutUserInput>;
};
export type CommentUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutUserInput, Prisma.CommentUncheckedUpdateWithoutUserInput>;
};
export type CommentUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutUserInput>;
};
export type CommentScalarWhereInput = {
    AND?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
    OR?: Prisma.CommentScalarWhereInput[];
    NOT?: Prisma.CommentScalarWhereInput | Prisma.CommentScalarWhereInput[];
    id?: Prisma.IntFilter<"Comment"> | number;
    cardId?: Prisma.IntFilter<"Comment"> | number;
    userId?: Prisma.IntFilter<"Comment"> | number;
    body?: Prisma.StringFilter<"Comment"> | string;
    createdAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Comment"> | Date | string;
};
export type CommentCreateWithoutCardInput = {
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutCommentsInput;
};
export type CommentUncheckedCreateWithoutCardInput = {
    id?: number;
    userId: number;
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentCreateOrConnectWithoutCardInput = {
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateWithoutCardInput, Prisma.CommentUncheckedCreateWithoutCardInput>;
};
export type CommentCreateManyCardInputEnvelope = {
    data: Prisma.CommentCreateManyCardInput | Prisma.CommentCreateManyCardInput[];
    skipDuplicates?: boolean;
};
export type CommentUpsertWithWhereUniqueWithoutCardInput = {
    where: Prisma.CommentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CommentUpdateWithoutCardInput, Prisma.CommentUncheckedUpdateWithoutCardInput>;
    create: Prisma.XOR<Prisma.CommentCreateWithoutCardInput, Prisma.CommentUncheckedCreateWithoutCardInput>;
};
export type CommentUpdateWithWhereUniqueWithoutCardInput = {
    where: Prisma.CommentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CommentUpdateWithoutCardInput, Prisma.CommentUncheckedUpdateWithoutCardInput>;
};
export type CommentUpdateManyWithWhereWithoutCardInput = {
    where: Prisma.CommentScalarWhereInput;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyWithoutCardInput>;
};
export type CommentCreateManyUserInput = {
    id?: number;
    cardId: number;
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentUpdateWithoutUserInput = {
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    card?: Prisma.CardUpdateOneRequiredWithoutCommentsNestedInput;
};
export type CommentUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    cardId?: Prisma.IntFieldUpdateOperationsInput | number;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    cardId?: Prisma.IntFieldUpdateOperationsInput | number;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentCreateManyCardInput = {
    id?: number;
    userId: number;
    body: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CommentUpdateWithoutCardInput = {
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCommentsNestedInput;
};
export type CommentUncheckedUpdateWithoutCardInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentUncheckedUpdateManyWithoutCardInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CommentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    userId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    card?: boolean | Prisma.CardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    userId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    card?: boolean | Prisma.CardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    cardId?: boolean;
    userId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    card?: boolean | Prisma.CardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["comment"]>;
export type CommentSelectScalar = {
    id?: boolean;
    cardId?: boolean;
    userId?: boolean;
    body?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CommentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "cardId" | "userId" | "body" | "createdAt" | "updatedAt", ExtArgs["result"]["comment"]>;
export type CommentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.CardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type CommentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.CardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type CommentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    card?: boolean | Prisma.CardDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $CommentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Comment";
    objects: {
        card: Prisma.$CardPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        cardId: number;
        userId: number;
        body: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["comment"]>;
    composites: {};
};
export type CommentGetPayload<S extends boolean | null | undefined | CommentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CommentPayload, S>;
export type CommentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CommentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CommentCountAggregateInputType | true;
};
export interface CommentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Comment'];
        meta: {
            name: 'Comment';
        };
    };
    findUnique<T extends CommentFindUniqueArgs>(args: Prisma.SelectSubset<T, CommentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CommentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CommentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CommentFindFirstArgs>(args?: Prisma.SelectSubset<T, CommentFindFirstArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CommentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CommentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CommentFindManyArgs>(args?: Prisma.SelectSubset<T, CommentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CommentCreateArgs>(args: Prisma.SelectSubset<T, CommentCreateArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CommentCreateManyArgs>(args?: Prisma.SelectSubset<T, CommentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CommentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CommentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CommentDeleteArgs>(args: Prisma.SelectSubset<T, CommentDeleteArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CommentUpdateArgs>(args: Prisma.SelectSubset<T, CommentUpdateArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CommentDeleteManyArgs>(args?: Prisma.SelectSubset<T, CommentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CommentUpdateManyArgs>(args: Prisma.SelectSubset<T, CommentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CommentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CommentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CommentUpsertArgs>(args: Prisma.SelectSubset<T, CommentUpsertArgs<ExtArgs>>): Prisma.Prisma__CommentClient<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CommentCountArgs>(args?: Prisma.Subset<T, CommentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CommentCountAggregateOutputType> : number>;
    aggregate<T extends CommentAggregateArgs>(args: Prisma.Subset<T, CommentAggregateArgs>): Prisma.PrismaPromise<GetCommentAggregateType<T>>;
    groupBy<T extends CommentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CommentGroupByArgs['orderBy'];
    } : {
        orderBy?: CommentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CommentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCommentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CommentFieldRefs;
}
export interface Prisma__CommentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    card<T extends Prisma.CardDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CardDefaultArgs<ExtArgs>>): Prisma.Prisma__CardClient<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CommentFieldRefs {
    readonly id: Prisma.FieldRef<"Comment", 'Int'>;
    readonly cardId: Prisma.FieldRef<"Comment", 'Int'>;
    readonly userId: Prisma.FieldRef<"Comment", 'Int'>;
    readonly body: Prisma.FieldRef<"Comment", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Comment", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Comment", 'DateTime'>;
}
export type CommentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where?: Prisma.CommentWhereInput;
    orderBy?: Prisma.CommentOrderByWithRelationInput | Prisma.CommentOrderByWithRelationInput[];
    cursor?: Prisma.CommentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CommentScalarFieldEnum | Prisma.CommentScalarFieldEnum[];
};
export type CommentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>;
};
export type CommentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CommentCreateManyInput | Prisma.CommentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CommentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    data: Prisma.CommentCreateManyInput | Prisma.CommentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CommentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CommentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyInput>;
    where?: Prisma.CommentWhereInput;
    limit?: number;
};
export type CommentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CommentUpdateManyMutationInput, Prisma.CommentUncheckedUpdateManyInput>;
    where?: Prisma.CommentWhereInput;
    limit?: number;
    include?: Prisma.CommentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CommentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CommentCreateInput, Prisma.CommentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CommentUpdateInput, Prisma.CommentUncheckedUpdateInput>;
};
export type CommentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
    where: Prisma.CommentWhereUniqueInput;
};
export type CommentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
    limit?: number;
};
export type CommentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CommentSelect<ExtArgs> | null;
    omit?: Prisma.CommentOmit<ExtArgs> | null;
    include?: Prisma.CommentInclude<ExtArgs> | null;
};
export {};
