import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserAvgAggregateOutputType = {
    id: number | null;
};
export type UserSumAggregateOutputType = {
    id: number | null;
};
export type UserMinAggregateOutputType = {
    id: number | null;
    email: string | null;
    passwordHash: string | null;
    name: string | null;
    avatarPath: string | null;
    emailVerifiedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: number | null;
    email: string | null;
    passwordHash: string | null;
    name: string | null;
    avatarPath: string | null;
    emailVerifiedAt: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    passwordHash: number;
    name: number;
    avatarPath: number;
    emailVerifiedAt: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserAvgAggregateInputType = {
    id?: true;
};
export type UserSumAggregateInputType = {
    id?: true;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    name?: true;
    avatarPath?: true;
    emailVerifiedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    name?: true;
    avatarPath?: true;
    emailVerifiedAt?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    passwordHash?: true;
    name?: true;
    avatarPath?: true;
    emailVerifiedAt?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _avg?: UserAvgAggregateInputType;
    _sum?: UserSumAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: number;
    email: string;
    passwordHash: string | null;
    name: string;
    avatarPath: string | null;
    emailVerifiedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _avg: UserAvgAggregateOutputType | null;
    _sum: UserSumAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.IntFilter<"User"> | number;
    email?: Prisma.StringFilter<"User"> | string;
    passwordHash?: Prisma.StringNullableFilter<"User"> | string | null;
    name?: Prisma.StringFilter<"User"> | string;
    avatarPath?: Prisma.StringNullableFilter<"User"> | string | null;
    emailVerifiedAt?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    authTokens?: Prisma.AuthTokenListRelationFilter;
    workspaceMembers?: Prisma.WorkspaceMemberListRelationFilter;
    workspaceInvitesSent?: Prisma.WorkspaceInviteListRelationFilter;
    workspaceActivities?: Prisma.WorkspaceActivityListRelationFilter;
    assignedCards?: Prisma.CardListRelationFilter;
    comments?: Prisma.CommentListRelationFilter;
    character?: Prisma.XOR<Prisma.CharacterNullableScalarRelationFilter, Prisma.CharacterWhereInput> | null;
    xpEvents?: Prisma.XpEventListRelationFilter;
    healthEvents?: Prisma.HealthEventListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatarPath?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailVerifiedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    authTokens?: Prisma.AuthTokenOrderByRelationAggregateInput;
    workspaceMembers?: Prisma.WorkspaceMemberOrderByRelationAggregateInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteOrderByRelationAggregateInput;
    workspaceActivities?: Prisma.WorkspaceActivityOrderByRelationAggregateInput;
    assignedCards?: Prisma.CardOrderByRelationAggregateInput;
    comments?: Prisma.CommentOrderByRelationAggregateInput;
    character?: Prisma.CharacterOrderByWithRelationInput;
    xpEvents?: Prisma.XpEventOrderByRelationAggregateInput;
    healthEvents?: Prisma.HealthEventOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    email?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    passwordHash?: Prisma.StringNullableFilter<"User"> | string | null;
    name?: Prisma.StringFilter<"User"> | string;
    avatarPath?: Prisma.StringNullableFilter<"User"> | string | null;
    emailVerifiedAt?: Prisma.DateTimeNullableFilter<"User"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    authTokens?: Prisma.AuthTokenListRelationFilter;
    workspaceMembers?: Prisma.WorkspaceMemberListRelationFilter;
    workspaceInvitesSent?: Prisma.WorkspaceInviteListRelationFilter;
    workspaceActivities?: Prisma.WorkspaceActivityListRelationFilter;
    assignedCards?: Prisma.CardListRelationFilter;
    comments?: Prisma.CommentListRelationFilter;
    character?: Prisma.XOR<Prisma.CharacterNullableScalarRelationFilter, Prisma.CharacterWhereInput> | null;
    xpEvents?: Prisma.XpEventListRelationFilter;
    healthEvents?: Prisma.HealthEventListRelationFilter;
}, "id" | "email">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrderInput | Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatarPath?: Prisma.SortOrderInput | Prisma.SortOrder;
    emailVerifiedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _avg?: Prisma.UserAvgOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
    _sum?: Prisma.UserSumOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"User"> | number;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    passwordHash?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    name?: Prisma.StringWithAggregatesFilter<"User"> | string;
    avatarPath?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    emailVerifiedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"User"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatarPath?: Prisma.SortOrder;
    emailVerifiedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatarPath?: Prisma.SortOrder;
    emailVerifiedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    passwordHash?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    avatarPath?: Prisma.SortOrder;
    emailVerifiedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type UserCreateNestedOneWithoutAuthTokensInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuthTokensInput, Prisma.UserUncheckedCreateWithoutAuthTokensInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuthTokensInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutAuthTokensNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAuthTokensInput, Prisma.UserUncheckedCreateWithoutAuthTokensInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAuthTokensInput;
    upsert?: Prisma.UserUpsertWithoutAuthTokensInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAuthTokensInput, Prisma.UserUpdateWithoutAuthTokensInput>, Prisma.UserUncheckedUpdateWithoutAuthTokensInput>;
};
export type UserCreateNestedOneWithoutWorkspaceMembersInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceMembersInput, Prisma.UserUncheckedCreateWithoutWorkspaceMembersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutWorkspaceMembersInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutWorkspaceMembersNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceMembersInput, Prisma.UserUncheckedCreateWithoutWorkspaceMembersInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutWorkspaceMembersInput;
    upsert?: Prisma.UserUpsertWithoutWorkspaceMembersInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutWorkspaceMembersInput, Prisma.UserUpdateWithoutWorkspaceMembersInput>, Prisma.UserUncheckedUpdateWithoutWorkspaceMembersInput>;
};
export type UserCreateNestedOneWithoutWorkspaceInvitesSentInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceInvitesSentInput, Prisma.UserUncheckedCreateWithoutWorkspaceInvitesSentInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutWorkspaceInvitesSentInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutWorkspaceInvitesSentNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceInvitesSentInput, Prisma.UserUncheckedCreateWithoutWorkspaceInvitesSentInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutWorkspaceInvitesSentInput;
    upsert?: Prisma.UserUpsertWithoutWorkspaceInvitesSentInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutWorkspaceInvitesSentInput, Prisma.UserUpdateWithoutWorkspaceInvitesSentInput>, Prisma.UserUncheckedUpdateWithoutWorkspaceInvitesSentInput>;
};
export type UserCreateNestedOneWithoutWorkspaceActivitiesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceActivitiesInput, Prisma.UserUncheckedCreateWithoutWorkspaceActivitiesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutWorkspaceActivitiesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutWorkspaceActivitiesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceActivitiesInput, Prisma.UserUncheckedCreateWithoutWorkspaceActivitiesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutWorkspaceActivitiesInput;
    upsert?: Prisma.UserUpsertWithoutWorkspaceActivitiesInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutWorkspaceActivitiesInput, Prisma.UserUpdateWithoutWorkspaceActivitiesInput>, Prisma.UserUncheckedUpdateWithoutWorkspaceActivitiesInput>;
};
export type UserCreateNestedOneWithoutAssignedCardsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAssignedCardsInput, Prisma.UserUncheckedCreateWithoutAssignedCardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAssignedCardsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutAssignedCardsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutAssignedCardsInput, Prisma.UserUncheckedCreateWithoutAssignedCardsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutAssignedCardsInput;
    upsert?: Prisma.UserUpsertWithoutAssignedCardsInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutAssignedCardsInput, Prisma.UserUpdateWithoutAssignedCardsInput>, Prisma.UserUncheckedUpdateWithoutAssignedCardsInput>;
};
export type UserCreateNestedOneWithoutCommentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCommentsInput, Prisma.UserUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCommentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutCommentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCommentsInput, Prisma.UserUncheckedCreateWithoutCommentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCommentsInput;
    upsert?: Prisma.UserUpsertWithoutCommentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCommentsInput, Prisma.UserUpdateWithoutCommentsInput>, Prisma.UserUncheckedUpdateWithoutCommentsInput>;
};
export type UserCreateNestedOneWithoutCharacterInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCharacterInput, Prisma.UserUncheckedCreateWithoutCharacterInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCharacterInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutCharacterNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCharacterInput, Prisma.UserUncheckedCreateWithoutCharacterInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCharacterInput;
    upsert?: Prisma.UserUpsertWithoutCharacterInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCharacterInput, Prisma.UserUpdateWithoutCharacterInput>, Prisma.UserUncheckedUpdateWithoutCharacterInput>;
};
export type UserCreateNestedOneWithoutXpEventsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutXpEventsInput, Prisma.UserUncheckedCreateWithoutXpEventsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutXpEventsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutXpEventsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutXpEventsInput, Prisma.UserUncheckedCreateWithoutXpEventsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutXpEventsInput;
    upsert?: Prisma.UserUpsertWithoutXpEventsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutXpEventsInput, Prisma.UserUpdateWithoutXpEventsInput>, Prisma.UserUncheckedUpdateWithoutXpEventsInput>;
};
export type UserCreateNestedOneWithoutHealthEventsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutHealthEventsInput, Prisma.UserUncheckedCreateWithoutHealthEventsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutHealthEventsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutHealthEventsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutHealthEventsInput, Prisma.UserUncheckedCreateWithoutHealthEventsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutHealthEventsInput;
    upsert?: Prisma.UserUpsertWithoutHealthEventsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutHealthEventsInput, Prisma.UserUpdateWithoutHealthEventsInput>, Prisma.UserUncheckedUpdateWithoutHealthEventsInput>;
};
export type UserCreateWithoutAuthTokensInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutAuthTokensInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutAuthTokensInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuthTokensInput, Prisma.UserUncheckedCreateWithoutAuthTokensInput>;
};
export type UserUpsertWithoutAuthTokensInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAuthTokensInput, Prisma.UserUncheckedUpdateWithoutAuthTokensInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAuthTokensInput, Prisma.UserUncheckedCreateWithoutAuthTokensInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAuthTokensInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAuthTokensInput, Prisma.UserUncheckedUpdateWithoutAuthTokensInput>;
};
export type UserUpdateWithoutAuthTokensInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutAuthTokensInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutWorkspaceMembersInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutWorkspaceMembersInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutWorkspaceMembersInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceMembersInput, Prisma.UserUncheckedCreateWithoutWorkspaceMembersInput>;
};
export type UserUpsertWithoutWorkspaceMembersInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutWorkspaceMembersInput, Prisma.UserUncheckedUpdateWithoutWorkspaceMembersInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceMembersInput, Prisma.UserUncheckedCreateWithoutWorkspaceMembersInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutWorkspaceMembersInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutWorkspaceMembersInput, Prisma.UserUncheckedUpdateWithoutWorkspaceMembersInput>;
};
export type UserUpdateWithoutWorkspaceMembersInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutWorkspaceMembersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutWorkspaceInvitesSentInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutWorkspaceInvitesSentInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutWorkspaceInvitesSentInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceInvitesSentInput, Prisma.UserUncheckedCreateWithoutWorkspaceInvitesSentInput>;
};
export type UserUpsertWithoutWorkspaceInvitesSentInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutWorkspaceInvitesSentInput, Prisma.UserUncheckedUpdateWithoutWorkspaceInvitesSentInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceInvitesSentInput, Prisma.UserUncheckedCreateWithoutWorkspaceInvitesSentInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutWorkspaceInvitesSentInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutWorkspaceInvitesSentInput, Prisma.UserUncheckedUpdateWithoutWorkspaceInvitesSentInput>;
};
export type UserUpdateWithoutWorkspaceInvitesSentInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutWorkspaceInvitesSentInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutWorkspaceActivitiesInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutWorkspaceActivitiesInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutWorkspaceActivitiesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceActivitiesInput, Prisma.UserUncheckedCreateWithoutWorkspaceActivitiesInput>;
};
export type UserUpsertWithoutWorkspaceActivitiesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutWorkspaceActivitiesInput, Prisma.UserUncheckedUpdateWithoutWorkspaceActivitiesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutWorkspaceActivitiesInput, Prisma.UserUncheckedCreateWithoutWorkspaceActivitiesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutWorkspaceActivitiesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutWorkspaceActivitiesInput, Prisma.UserUncheckedUpdateWithoutWorkspaceActivitiesInput>;
};
export type UserUpdateWithoutWorkspaceActivitiesInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutWorkspaceActivitiesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutAssignedCardsInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutAssignedCardsInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutAssignedCardsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutAssignedCardsInput, Prisma.UserUncheckedCreateWithoutAssignedCardsInput>;
};
export type UserUpsertWithoutAssignedCardsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutAssignedCardsInput, Prisma.UserUncheckedUpdateWithoutAssignedCardsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutAssignedCardsInput, Prisma.UserUncheckedCreateWithoutAssignedCardsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutAssignedCardsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutAssignedCardsInput, Prisma.UserUncheckedUpdateWithoutAssignedCardsInput>;
};
export type UserUpdateWithoutAssignedCardsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutAssignedCardsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutCommentsInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutCommentsInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutCommentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCommentsInput, Prisma.UserUncheckedCreateWithoutCommentsInput>;
};
export type UserUpsertWithoutCommentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCommentsInput, Prisma.UserUncheckedUpdateWithoutCommentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCommentsInput, Prisma.UserUncheckedCreateWithoutCommentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCommentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCommentsInput, Prisma.UserUncheckedUpdateWithoutCommentsInput>;
};
export type UserUpdateWithoutCommentsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutCommentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutCharacterInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutCharacterInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutCharacterInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCharacterInput, Prisma.UserUncheckedCreateWithoutCharacterInput>;
};
export type UserUpsertWithoutCharacterInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCharacterInput, Prisma.UserUncheckedUpdateWithoutCharacterInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCharacterInput, Prisma.UserUncheckedCreateWithoutCharacterInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCharacterInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCharacterInput, Prisma.UserUncheckedUpdateWithoutCharacterInput>;
};
export type UserUpdateWithoutCharacterInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutCharacterInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutXpEventsInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    healthEvents?: Prisma.HealthEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutXpEventsInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    healthEvents?: Prisma.HealthEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutXpEventsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutXpEventsInput, Prisma.UserUncheckedCreateWithoutXpEventsInput>;
};
export type UserUpsertWithoutXpEventsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutXpEventsInput, Prisma.UserUncheckedUpdateWithoutXpEventsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutXpEventsInput, Prisma.UserUncheckedCreateWithoutXpEventsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutXpEventsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutXpEventsInput, Prisma.UserUncheckedUpdateWithoutXpEventsInput>;
};
export type UserUpdateWithoutXpEventsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutXpEventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    healthEvents?: Prisma.HealthEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutHealthEventsInput = {
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutHealthEventsInput = {
    id?: number;
    email: string;
    passwordHash?: string | null;
    name: string;
    avatarPath?: string | null;
    emailVerifiedAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    authTokens?: Prisma.AuthTokenUncheckedCreateNestedManyWithoutUserInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedCreateNestedManyWithoutUserInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedCreateNestedManyWithoutInvitedByInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedCreateNestedManyWithoutActorInput;
    assignedCards?: Prisma.CardUncheckedCreateNestedManyWithoutAssigneeInput;
    comments?: Prisma.CommentUncheckedCreateNestedManyWithoutUserInput;
    character?: Prisma.CharacterUncheckedCreateNestedOneWithoutUserInput;
    xpEvents?: Prisma.XpEventUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutHealthEventsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutHealthEventsInput, Prisma.UserUncheckedCreateWithoutHealthEventsInput>;
};
export type UserUpsertWithoutHealthEventsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutHealthEventsInput, Prisma.UserUncheckedUpdateWithoutHealthEventsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutHealthEventsInput, Prisma.UserUncheckedCreateWithoutHealthEventsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutHealthEventsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutHealthEventsInput, Prisma.UserUncheckedUpdateWithoutHealthEventsInput>;
};
export type UserUpdateWithoutHealthEventsInput = {
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutHealthEventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    passwordHash?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    avatarPath?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    emailVerifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    authTokens?: Prisma.AuthTokenUncheckedUpdateManyWithoutUserNestedInput;
    workspaceMembers?: Prisma.WorkspaceMemberUncheckedUpdateManyWithoutUserNestedInput;
    workspaceInvitesSent?: Prisma.WorkspaceInviteUncheckedUpdateManyWithoutInvitedByNestedInput;
    workspaceActivities?: Prisma.WorkspaceActivityUncheckedUpdateManyWithoutActorNestedInput;
    assignedCards?: Prisma.CardUncheckedUpdateManyWithoutAssigneeNestedInput;
    comments?: Prisma.CommentUncheckedUpdateManyWithoutUserNestedInput;
    character?: Prisma.CharacterUncheckedUpdateOneWithoutUserNestedInput;
    xpEvents?: Prisma.XpEventUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCountOutputType = {
    authTokens: number;
    workspaceMembers: number;
    workspaceInvitesSent: number;
    workspaceActivities: number;
    assignedCards: number;
    comments: number;
    xpEvents: number;
    healthEvents: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    authTokens?: boolean | UserCountOutputTypeCountAuthTokensArgs;
    workspaceMembers?: boolean | UserCountOutputTypeCountWorkspaceMembersArgs;
    workspaceInvitesSent?: boolean | UserCountOutputTypeCountWorkspaceInvitesSentArgs;
    workspaceActivities?: boolean | UserCountOutputTypeCountWorkspaceActivitiesArgs;
    assignedCards?: boolean | UserCountOutputTypeCountAssignedCardsArgs;
    comments?: boolean | UserCountOutputTypeCountCommentsArgs;
    xpEvents?: boolean | UserCountOutputTypeCountXpEventsArgs;
    healthEvents?: boolean | UserCountOutputTypeCountHealthEventsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountAuthTokensArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AuthTokenWhereInput;
};
export type UserCountOutputTypeCountWorkspaceMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceMemberWhereInput;
};
export type UserCountOutputTypeCountWorkspaceInvitesSentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceInviteWhereInput;
};
export type UserCountOutputTypeCountWorkspaceActivitiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.WorkspaceActivityWhereInput;
};
export type UserCountOutputTypeCountAssignedCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CardWhereInput;
};
export type UserCountOutputTypeCountCommentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CommentWhereInput;
};
export type UserCountOutputTypeCountXpEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.XpEventWhereInput;
};
export type UserCountOutputTypeCountHealthEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.HealthEventWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    name?: boolean;
    avatarPath?: boolean;
    emailVerifiedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    authTokens?: boolean | Prisma.User$authTokensArgs<ExtArgs>;
    workspaceMembers?: boolean | Prisma.User$workspaceMembersArgs<ExtArgs>;
    workspaceInvitesSent?: boolean | Prisma.User$workspaceInvitesSentArgs<ExtArgs>;
    workspaceActivities?: boolean | Prisma.User$workspaceActivitiesArgs<ExtArgs>;
    assignedCards?: boolean | Prisma.User$assignedCardsArgs<ExtArgs>;
    comments?: boolean | Prisma.User$commentsArgs<ExtArgs>;
    character?: boolean | Prisma.User$characterArgs<ExtArgs>;
    xpEvents?: boolean | Prisma.User$xpEventsArgs<ExtArgs>;
    healthEvents?: boolean | Prisma.User$healthEventsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    name?: boolean;
    avatarPath?: boolean;
    emailVerifiedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    name?: boolean;
    avatarPath?: boolean;
    emailVerifiedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    passwordHash?: boolean;
    name?: boolean;
    avatarPath?: boolean;
    emailVerifiedAt?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "passwordHash" | "name" | "avatarPath" | "emailVerifiedAt" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    authTokens?: boolean | Prisma.User$authTokensArgs<ExtArgs>;
    workspaceMembers?: boolean | Prisma.User$workspaceMembersArgs<ExtArgs>;
    workspaceInvitesSent?: boolean | Prisma.User$workspaceInvitesSentArgs<ExtArgs>;
    workspaceActivities?: boolean | Prisma.User$workspaceActivitiesArgs<ExtArgs>;
    assignedCards?: boolean | Prisma.User$assignedCardsArgs<ExtArgs>;
    comments?: boolean | Prisma.User$commentsArgs<ExtArgs>;
    character?: boolean | Prisma.User$characterArgs<ExtArgs>;
    xpEvents?: boolean | Prisma.User$xpEventsArgs<ExtArgs>;
    healthEvents?: boolean | Prisma.User$healthEventsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        authTokens: Prisma.$AuthTokenPayload<ExtArgs>[];
        workspaceMembers: Prisma.$WorkspaceMemberPayload<ExtArgs>[];
        workspaceInvitesSent: Prisma.$WorkspaceInvitePayload<ExtArgs>[];
        workspaceActivities: Prisma.$WorkspaceActivityPayload<ExtArgs>[];
        assignedCards: Prisma.$CardPayload<ExtArgs>[];
        comments: Prisma.$CommentPayload<ExtArgs>[];
        character: Prisma.$CharacterPayload<ExtArgs> | null;
        xpEvents: Prisma.$XpEventPayload<ExtArgs>[];
        healthEvents: Prisma.$HealthEventPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        email: string;
        passwordHash: string | null;
        name: string;
        avatarPath: string | null;
        emailVerifiedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    authTokens<T extends Prisma.User$authTokensArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$authTokensArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AuthTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    workspaceMembers<T extends Prisma.User$workspaceMembersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$workspaceMembersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceMemberPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    workspaceInvitesSent<T extends Prisma.User$workspaceInvitesSentArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$workspaceInvitesSentArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceInvitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    workspaceActivities<T extends Prisma.User$workspaceActivitiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$workspaceActivitiesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$WorkspaceActivityPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    assignedCards<T extends Prisma.User$assignedCardsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$assignedCardsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CardPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    comments<T extends Prisma.User$commentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$commentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CommentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    character<T extends Prisma.User$characterArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$characterArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    xpEvents<T extends Prisma.User$xpEventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$xpEventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$XpEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    healthEvents<T extends Prisma.User$healthEventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$healthEventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$HealthEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'Int'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly passwordHash: Prisma.FieldRef<"User", 'String'>;
    readonly name: Prisma.FieldRef<"User", 'String'>;
    readonly avatarPath: Prisma.FieldRef<"User", 'String'>;
    readonly emailVerifiedAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$authTokensArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$workspaceMembersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceMemberSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceMemberOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceMemberInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceMemberWhereInput;
    orderBy?: Prisma.WorkspaceMemberOrderByWithRelationInput | Prisma.WorkspaceMemberOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceMemberWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceMemberScalarFieldEnum | Prisma.WorkspaceMemberScalarFieldEnum[];
};
export type User$workspaceInvitesSentArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.WorkspaceInviteSelect<ExtArgs> | null;
    omit?: Prisma.WorkspaceInviteOmit<ExtArgs> | null;
    include?: Prisma.WorkspaceInviteInclude<ExtArgs> | null;
    where?: Prisma.WorkspaceInviteWhereInput;
    orderBy?: Prisma.WorkspaceInviteOrderByWithRelationInput | Prisma.WorkspaceInviteOrderByWithRelationInput[];
    cursor?: Prisma.WorkspaceInviteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.WorkspaceInviteScalarFieldEnum | Prisma.WorkspaceInviteScalarFieldEnum[];
};
export type User$workspaceActivitiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$assignedCardsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$commentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$characterArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    where?: Prisma.CharacterWhereInput;
};
export type User$xpEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$healthEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
