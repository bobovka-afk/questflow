import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type CharacterModel = runtime.Types.Result.DefaultSelection<Prisma.$CharacterPayload>;
export type AggregateCharacter = {
    _count: CharacterCountAggregateOutputType | null;
    _avg: CharacterAvgAggregateOutputType | null;
    _sum: CharacterSumAggregateOutputType | null;
    _min: CharacterMinAggregateOutputType | null;
    _max: CharacterMaxAggregateOutputType | null;
};
export type CharacterAvgAggregateOutputType = {
    id: number | null;
    userId: number | null;
    currentXp: number | null;
    level: number | null;
    health: number | null;
    dailyTaskXpCount: number | null;
    checkinStreak: number | null;
};
export type CharacterSumAggregateOutputType = {
    id: number | null;
    userId: number | null;
    currentXp: number | null;
    level: number | null;
    health: number | null;
    dailyTaskXpCount: number | null;
    checkinStreak: number | null;
};
export type CharacterMinAggregateOutputType = {
    id: number | null;
    userId: number | null;
    name: string | null;
    gender: $Enums.GenderCharacter | null;
    avatarPreset: $Enums.CharacterAvatarPreset | null;
    currentXp: number | null;
    level: number | null;
    health: number | null;
    dailyTaskXpCount: number | null;
    checkinStreak: number | null;
    lastCheckinDayKey: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CharacterMaxAggregateOutputType = {
    id: number | null;
    userId: number | null;
    name: string | null;
    gender: $Enums.GenderCharacter | null;
    avatarPreset: $Enums.CharacterAvatarPreset | null;
    currentXp: number | null;
    level: number | null;
    health: number | null;
    dailyTaskXpCount: number | null;
    checkinStreak: number | null;
    lastCheckinDayKey: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type CharacterCountAggregateOutputType = {
    id: number;
    userId: number;
    name: number;
    gender: number;
    avatarPreset: number;
    currentXp: number;
    level: number;
    health: number;
    dailyTaskXpCount: number;
    checkinStreak: number;
    lastCheckinDayKey: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type CharacterAvgAggregateInputType = {
    id?: true;
    userId?: true;
    currentXp?: true;
    level?: true;
    health?: true;
    dailyTaskXpCount?: true;
    checkinStreak?: true;
};
export type CharacterSumAggregateInputType = {
    id?: true;
    userId?: true;
    currentXp?: true;
    level?: true;
    health?: true;
    dailyTaskXpCount?: true;
    checkinStreak?: true;
};
export type CharacterMinAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    gender?: true;
    avatarPreset?: true;
    currentXp?: true;
    level?: true;
    health?: true;
    dailyTaskXpCount?: true;
    checkinStreak?: true;
    lastCheckinDayKey?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CharacterMaxAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    gender?: true;
    avatarPreset?: true;
    currentXp?: true;
    level?: true;
    health?: true;
    dailyTaskXpCount?: true;
    checkinStreak?: true;
    lastCheckinDayKey?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type CharacterCountAggregateInputType = {
    id?: true;
    userId?: true;
    name?: true;
    gender?: true;
    avatarPreset?: true;
    currentXp?: true;
    level?: true;
    health?: true;
    dailyTaskXpCount?: true;
    checkinStreak?: true;
    lastCheckinDayKey?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type CharacterAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CharacterWhereInput;
    orderBy?: Prisma.CharacterOrderByWithRelationInput | Prisma.CharacterOrderByWithRelationInput[];
    cursor?: Prisma.CharacterWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CharacterCountAggregateInputType;
    _avg?: CharacterAvgAggregateInputType;
    _sum?: CharacterSumAggregateInputType;
    _min?: CharacterMinAggregateInputType;
    _max?: CharacterMaxAggregateInputType;
};
export type GetCharacterAggregateType<T extends CharacterAggregateArgs> = {
    [P in keyof T & keyof AggregateCharacter]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCharacter[P]> : Prisma.GetScalarType<T[P], AggregateCharacter[P]>;
};
export type CharacterGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CharacterWhereInput;
    orderBy?: Prisma.CharacterOrderByWithAggregationInput | Prisma.CharacterOrderByWithAggregationInput[];
    by: Prisma.CharacterScalarFieldEnum[] | Prisma.CharacterScalarFieldEnum;
    having?: Prisma.CharacterScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CharacterCountAggregateInputType | true;
    _avg?: CharacterAvgAggregateInputType;
    _sum?: CharacterSumAggregateInputType;
    _min?: CharacterMinAggregateInputType;
    _max?: CharacterMaxAggregateInputType;
};
export type CharacterGroupByOutputType = {
    id: number;
    userId: number;
    name: string;
    gender: $Enums.GenderCharacter;
    avatarPreset: $Enums.CharacterAvatarPreset;
    currentXp: number;
    level: number;
    health: number;
    dailyTaskXpCount: number;
    checkinStreak: number;
    lastCheckinDayKey: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: CharacterCountAggregateOutputType | null;
    _avg: CharacterAvgAggregateOutputType | null;
    _sum: CharacterSumAggregateOutputType | null;
    _min: CharacterMinAggregateOutputType | null;
    _max: CharacterMaxAggregateOutputType | null;
};
type GetCharacterGroupByPayload<T extends CharacterGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CharacterGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CharacterGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CharacterGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CharacterGroupByOutputType[P]>;
}>>;
export type CharacterWhereInput = {
    AND?: Prisma.CharacterWhereInput | Prisma.CharacterWhereInput[];
    OR?: Prisma.CharacterWhereInput[];
    NOT?: Prisma.CharacterWhereInput | Prisma.CharacterWhereInput[];
    id?: Prisma.IntFilter<"Character"> | number;
    userId?: Prisma.IntFilter<"Character"> | number;
    name?: Prisma.StringFilter<"Character"> | string;
    gender?: Prisma.EnumGenderCharacterFilter<"Character"> | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetFilter<"Character"> | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntFilter<"Character"> | number;
    level?: Prisma.IntFilter<"Character"> | number;
    health?: Prisma.IntFilter<"Character"> | number;
    dailyTaskXpCount?: Prisma.IntFilter<"Character"> | number;
    checkinStreak?: Prisma.IntFilter<"Character"> | number;
    lastCheckinDayKey?: Prisma.DateTimeNullableFilter<"Character"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Character"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Character"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type CharacterOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    gender?: Prisma.SortOrder;
    avatarPreset?: Prisma.SortOrder;
    currentXp?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    health?: Prisma.SortOrder;
    dailyTaskXpCount?: Prisma.SortOrder;
    checkinStreak?: Prisma.SortOrder;
    lastCheckinDayKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type CharacterWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    userId?: number;
    AND?: Prisma.CharacterWhereInput | Prisma.CharacterWhereInput[];
    OR?: Prisma.CharacterWhereInput[];
    NOT?: Prisma.CharacterWhereInput | Prisma.CharacterWhereInput[];
    name?: Prisma.StringFilter<"Character"> | string;
    gender?: Prisma.EnumGenderCharacterFilter<"Character"> | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetFilter<"Character"> | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntFilter<"Character"> | number;
    level?: Prisma.IntFilter<"Character"> | number;
    health?: Prisma.IntFilter<"Character"> | number;
    dailyTaskXpCount?: Prisma.IntFilter<"Character"> | number;
    checkinStreak?: Prisma.IntFilter<"Character"> | number;
    lastCheckinDayKey?: Prisma.DateTimeNullableFilter<"Character"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Character"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Character"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "userId">;
export type CharacterOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    gender?: Prisma.SortOrder;
    avatarPreset?: Prisma.SortOrder;
    currentXp?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    health?: Prisma.SortOrder;
    dailyTaskXpCount?: Prisma.SortOrder;
    checkinStreak?: Prisma.SortOrder;
    lastCheckinDayKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CharacterCountOrderByAggregateInput;
    _avg?: Prisma.CharacterAvgOrderByAggregateInput;
    _max?: Prisma.CharacterMaxOrderByAggregateInput;
    _min?: Prisma.CharacterMinOrderByAggregateInput;
    _sum?: Prisma.CharacterSumOrderByAggregateInput;
};
export type CharacterScalarWhereWithAggregatesInput = {
    AND?: Prisma.CharacterScalarWhereWithAggregatesInput | Prisma.CharacterScalarWhereWithAggregatesInput[];
    OR?: Prisma.CharacterScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CharacterScalarWhereWithAggregatesInput | Prisma.CharacterScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Character"> | number;
    userId?: Prisma.IntWithAggregatesFilter<"Character"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Character"> | string;
    gender?: Prisma.EnumGenderCharacterWithAggregatesFilter<"Character"> | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetWithAggregatesFilter<"Character"> | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntWithAggregatesFilter<"Character"> | number;
    level?: Prisma.IntWithAggregatesFilter<"Character"> | number;
    health?: Prisma.IntWithAggregatesFilter<"Character"> | number;
    dailyTaskXpCount?: Prisma.IntWithAggregatesFilter<"Character"> | number;
    checkinStreak?: Prisma.IntWithAggregatesFilter<"Character"> | number;
    lastCheckinDayKey?: Prisma.DateTimeNullableWithAggregatesFilter<"Character"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Character"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Character"> | Date | string;
};
export type CharacterCreateInput = {
    name: string;
    gender: $Enums.GenderCharacter;
    avatarPreset: $Enums.CharacterAvatarPreset;
    currentXp?: number;
    level?: number;
    health?: number;
    dailyTaskXpCount?: number;
    checkinStreak?: number;
    lastCheckinDayKey?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutCharacterInput;
};
export type CharacterUncheckedCreateInput = {
    id?: number;
    userId: number;
    name: string;
    gender: $Enums.GenderCharacter;
    avatarPreset: $Enums.CharacterAvatarPreset;
    currentXp?: number;
    level?: number;
    health?: number;
    dailyTaskXpCount?: number;
    checkinStreak?: number;
    lastCheckinDayKey?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CharacterUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    gender?: Prisma.EnumGenderCharacterFieldUpdateOperationsInput | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetFieldUpdateOperationsInput | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntFieldUpdateOperationsInput | number;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    health?: Prisma.IntFieldUpdateOperationsInput | number;
    dailyTaskXpCount?: Prisma.IntFieldUpdateOperationsInput | number;
    checkinStreak?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckinDayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutCharacterNestedInput;
};
export type CharacterUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    gender?: Prisma.EnumGenderCharacterFieldUpdateOperationsInput | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetFieldUpdateOperationsInput | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntFieldUpdateOperationsInput | number;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    health?: Prisma.IntFieldUpdateOperationsInput | number;
    dailyTaskXpCount?: Prisma.IntFieldUpdateOperationsInput | number;
    checkinStreak?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckinDayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CharacterCreateManyInput = {
    id?: number;
    userId: number;
    name: string;
    gender: $Enums.GenderCharacter;
    avatarPreset: $Enums.CharacterAvatarPreset;
    currentXp?: number;
    level?: number;
    health?: number;
    dailyTaskXpCount?: number;
    checkinStreak?: number;
    lastCheckinDayKey?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CharacterUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    gender?: Prisma.EnumGenderCharacterFieldUpdateOperationsInput | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetFieldUpdateOperationsInput | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntFieldUpdateOperationsInput | number;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    health?: Prisma.IntFieldUpdateOperationsInput | number;
    dailyTaskXpCount?: Prisma.IntFieldUpdateOperationsInput | number;
    checkinStreak?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckinDayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CharacterUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    userId?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    gender?: Prisma.EnumGenderCharacterFieldUpdateOperationsInput | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetFieldUpdateOperationsInput | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntFieldUpdateOperationsInput | number;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    health?: Prisma.IntFieldUpdateOperationsInput | number;
    dailyTaskXpCount?: Prisma.IntFieldUpdateOperationsInput | number;
    checkinStreak?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckinDayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CharacterNullableScalarRelationFilter = {
    is?: Prisma.CharacterWhereInput | null;
    isNot?: Prisma.CharacterWhereInput | null;
};
export type CharacterCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    gender?: Prisma.SortOrder;
    avatarPreset?: Prisma.SortOrder;
    currentXp?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    health?: Prisma.SortOrder;
    dailyTaskXpCount?: Prisma.SortOrder;
    checkinStreak?: Prisma.SortOrder;
    lastCheckinDayKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CharacterAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    currentXp?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    health?: Prisma.SortOrder;
    dailyTaskXpCount?: Prisma.SortOrder;
    checkinStreak?: Prisma.SortOrder;
};
export type CharacterMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    gender?: Prisma.SortOrder;
    avatarPreset?: Prisma.SortOrder;
    currentXp?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    health?: Prisma.SortOrder;
    dailyTaskXpCount?: Prisma.SortOrder;
    checkinStreak?: Prisma.SortOrder;
    lastCheckinDayKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CharacterMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    gender?: Prisma.SortOrder;
    avatarPreset?: Prisma.SortOrder;
    currentXp?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    health?: Prisma.SortOrder;
    dailyTaskXpCount?: Prisma.SortOrder;
    checkinStreak?: Prisma.SortOrder;
    lastCheckinDayKey?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CharacterSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    currentXp?: Prisma.SortOrder;
    level?: Prisma.SortOrder;
    health?: Prisma.SortOrder;
    dailyTaskXpCount?: Prisma.SortOrder;
    checkinStreak?: Prisma.SortOrder;
};
export type CharacterCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CharacterCreateWithoutUserInput, Prisma.CharacterUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.CharacterCreateOrConnectWithoutUserInput;
    connect?: Prisma.CharacterWhereUniqueInput;
};
export type CharacterUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.CharacterCreateWithoutUserInput, Prisma.CharacterUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.CharacterCreateOrConnectWithoutUserInput;
    connect?: Prisma.CharacterWhereUniqueInput;
};
export type CharacterUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CharacterCreateWithoutUserInput, Prisma.CharacterUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.CharacterCreateOrConnectWithoutUserInput;
    upsert?: Prisma.CharacterUpsertWithoutUserInput;
    disconnect?: Prisma.CharacterWhereInput | boolean;
    delete?: Prisma.CharacterWhereInput | boolean;
    connect?: Prisma.CharacterWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CharacterUpdateToOneWithWhereWithoutUserInput, Prisma.CharacterUpdateWithoutUserInput>, Prisma.CharacterUncheckedUpdateWithoutUserInput>;
};
export type CharacterUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.CharacterCreateWithoutUserInput, Prisma.CharacterUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.CharacterCreateOrConnectWithoutUserInput;
    upsert?: Prisma.CharacterUpsertWithoutUserInput;
    disconnect?: Prisma.CharacterWhereInput | boolean;
    delete?: Prisma.CharacterWhereInput | boolean;
    connect?: Prisma.CharacterWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CharacterUpdateToOneWithWhereWithoutUserInput, Prisma.CharacterUpdateWithoutUserInput>, Prisma.CharacterUncheckedUpdateWithoutUserInput>;
};
export type EnumGenderCharacterFieldUpdateOperationsInput = {
    set?: $Enums.GenderCharacter;
};
export type EnumCharacterAvatarPresetFieldUpdateOperationsInput = {
    set?: $Enums.CharacterAvatarPreset;
};
export type CharacterCreateWithoutUserInput = {
    name: string;
    gender: $Enums.GenderCharacter;
    avatarPreset: $Enums.CharacterAvatarPreset;
    currentXp?: number;
    level?: number;
    health?: number;
    dailyTaskXpCount?: number;
    checkinStreak?: number;
    lastCheckinDayKey?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CharacterUncheckedCreateWithoutUserInput = {
    id?: number;
    name: string;
    gender: $Enums.GenderCharacter;
    avatarPreset: $Enums.CharacterAvatarPreset;
    currentXp?: number;
    level?: number;
    health?: number;
    dailyTaskXpCount?: number;
    checkinStreak?: number;
    lastCheckinDayKey?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type CharacterCreateOrConnectWithoutUserInput = {
    where: Prisma.CharacterWhereUniqueInput;
    create: Prisma.XOR<Prisma.CharacterCreateWithoutUserInput, Prisma.CharacterUncheckedCreateWithoutUserInput>;
};
export type CharacterUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.CharacterUpdateWithoutUserInput, Prisma.CharacterUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.CharacterCreateWithoutUserInput, Prisma.CharacterUncheckedCreateWithoutUserInput>;
    where?: Prisma.CharacterWhereInput;
};
export type CharacterUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.CharacterWhereInput;
    data: Prisma.XOR<Prisma.CharacterUpdateWithoutUserInput, Prisma.CharacterUncheckedUpdateWithoutUserInput>;
};
export type CharacterUpdateWithoutUserInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    gender?: Prisma.EnumGenderCharacterFieldUpdateOperationsInput | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetFieldUpdateOperationsInput | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntFieldUpdateOperationsInput | number;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    health?: Prisma.IntFieldUpdateOperationsInput | number;
    dailyTaskXpCount?: Prisma.IntFieldUpdateOperationsInput | number;
    checkinStreak?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckinDayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CharacterUncheckedUpdateWithoutUserInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    gender?: Prisma.EnumGenderCharacterFieldUpdateOperationsInput | $Enums.GenderCharacter;
    avatarPreset?: Prisma.EnumCharacterAvatarPresetFieldUpdateOperationsInput | $Enums.CharacterAvatarPreset;
    currentXp?: Prisma.IntFieldUpdateOperationsInput | number;
    level?: Prisma.IntFieldUpdateOperationsInput | number;
    health?: Prisma.IntFieldUpdateOperationsInput | number;
    dailyTaskXpCount?: Prisma.IntFieldUpdateOperationsInput | number;
    checkinStreak?: Prisma.IntFieldUpdateOperationsInput | number;
    lastCheckinDayKey?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CharacterSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    gender?: boolean;
    avatarPreset?: boolean;
    currentXp?: boolean;
    level?: boolean;
    health?: boolean;
    dailyTaskXpCount?: boolean;
    checkinStreak?: boolean;
    lastCheckinDayKey?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["character"]>;
export type CharacterSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    gender?: boolean;
    avatarPreset?: boolean;
    currentXp?: boolean;
    level?: boolean;
    health?: boolean;
    dailyTaskXpCount?: boolean;
    checkinStreak?: boolean;
    lastCheckinDayKey?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["character"]>;
export type CharacterSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    gender?: boolean;
    avatarPreset?: boolean;
    currentXp?: boolean;
    level?: boolean;
    health?: boolean;
    dailyTaskXpCount?: boolean;
    checkinStreak?: boolean;
    lastCheckinDayKey?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["character"]>;
export type CharacterSelectScalar = {
    id?: boolean;
    userId?: boolean;
    name?: boolean;
    gender?: boolean;
    avatarPreset?: boolean;
    currentXp?: boolean;
    level?: boolean;
    health?: boolean;
    dailyTaskXpCount?: boolean;
    checkinStreak?: boolean;
    lastCheckinDayKey?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type CharacterOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "name" | "gender" | "avatarPreset" | "currentXp" | "level" | "health" | "dailyTaskXpCount" | "checkinStreak" | "lastCheckinDayKey" | "createdAt" | "updatedAt", ExtArgs["result"]["character"]>;
export type CharacterInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type CharacterIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type CharacterIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $CharacterPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Character";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        userId: number;
        name: string;
        gender: $Enums.GenderCharacter;
        avatarPreset: $Enums.CharacterAvatarPreset;
        currentXp: number;
        level: number;
        health: number;
        dailyTaskXpCount: number;
        checkinStreak: number;
        lastCheckinDayKey: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["character"]>;
    composites: {};
};
export type CharacterGetPayload<S extends boolean | null | undefined | CharacterDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CharacterPayload, S>;
export type CharacterCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CharacterFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CharacterCountAggregateInputType | true;
};
export interface CharacterDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Character'];
        meta: {
            name: 'Character';
        };
    };
    findUnique<T extends CharacterFindUniqueArgs>(args: Prisma.SelectSubset<T, CharacterFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CharacterFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CharacterFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CharacterFindFirstArgs>(args?: Prisma.SelectSubset<T, CharacterFindFirstArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CharacterFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CharacterFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CharacterFindManyArgs>(args?: Prisma.SelectSubset<T, CharacterFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CharacterCreateArgs>(args: Prisma.SelectSubset<T, CharacterCreateArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CharacterCreateManyArgs>(args?: Prisma.SelectSubset<T, CharacterCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CharacterCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CharacterCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CharacterDeleteArgs>(args: Prisma.SelectSubset<T, CharacterDeleteArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CharacterUpdateArgs>(args: Prisma.SelectSubset<T, CharacterUpdateArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CharacterDeleteManyArgs>(args?: Prisma.SelectSubset<T, CharacterDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CharacterUpdateManyArgs>(args: Prisma.SelectSubset<T, CharacterUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CharacterUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CharacterUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CharacterUpsertArgs>(args: Prisma.SelectSubset<T, CharacterUpsertArgs<ExtArgs>>): Prisma.Prisma__CharacterClient<runtime.Types.Result.GetResult<Prisma.$CharacterPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CharacterCountArgs>(args?: Prisma.Subset<T, CharacterCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CharacterCountAggregateOutputType> : number>;
    aggregate<T extends CharacterAggregateArgs>(args: Prisma.Subset<T, CharacterAggregateArgs>): Prisma.PrismaPromise<GetCharacterAggregateType<T>>;
    groupBy<T extends CharacterGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CharacterGroupByArgs['orderBy'];
    } : {
        orderBy?: CharacterGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CharacterGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCharacterGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CharacterFieldRefs;
}
export interface Prisma__CharacterClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CharacterFieldRefs {
    readonly id: Prisma.FieldRef<"Character", 'Int'>;
    readonly userId: Prisma.FieldRef<"Character", 'Int'>;
    readonly name: Prisma.FieldRef<"Character", 'String'>;
    readonly gender: Prisma.FieldRef<"Character", 'GenderCharacter'>;
    readonly avatarPreset: Prisma.FieldRef<"Character", 'CharacterAvatarPreset'>;
    readonly currentXp: Prisma.FieldRef<"Character", 'Int'>;
    readonly level: Prisma.FieldRef<"Character", 'Int'>;
    readonly health: Prisma.FieldRef<"Character", 'Int'>;
    readonly dailyTaskXpCount: Prisma.FieldRef<"Character", 'Int'>;
    readonly checkinStreak: Prisma.FieldRef<"Character", 'Int'>;
    readonly lastCheckinDayKey: Prisma.FieldRef<"Character", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Character", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Character", 'DateTime'>;
}
export type CharacterFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    where: Prisma.CharacterWhereUniqueInput;
};
export type CharacterFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    where: Prisma.CharacterWhereUniqueInput;
};
export type CharacterFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    where?: Prisma.CharacterWhereInput;
    orderBy?: Prisma.CharacterOrderByWithRelationInput | Prisma.CharacterOrderByWithRelationInput[];
    cursor?: Prisma.CharacterWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CharacterScalarFieldEnum | Prisma.CharacterScalarFieldEnum[];
};
export type CharacterFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    where?: Prisma.CharacterWhereInput;
    orderBy?: Prisma.CharacterOrderByWithRelationInput | Prisma.CharacterOrderByWithRelationInput[];
    cursor?: Prisma.CharacterWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CharacterScalarFieldEnum | Prisma.CharacterScalarFieldEnum[];
};
export type CharacterFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    where?: Prisma.CharacterWhereInput;
    orderBy?: Prisma.CharacterOrderByWithRelationInput | Prisma.CharacterOrderByWithRelationInput[];
    cursor?: Prisma.CharacterWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CharacterScalarFieldEnum | Prisma.CharacterScalarFieldEnum[];
};
export type CharacterCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CharacterCreateInput, Prisma.CharacterUncheckedCreateInput>;
};
export type CharacterCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CharacterCreateManyInput | Prisma.CharacterCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CharacterCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    data: Prisma.CharacterCreateManyInput | Prisma.CharacterCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CharacterIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CharacterUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CharacterUpdateInput, Prisma.CharacterUncheckedUpdateInput>;
    where: Prisma.CharacterWhereUniqueInput;
};
export type CharacterUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CharacterUpdateManyMutationInput, Prisma.CharacterUncheckedUpdateManyInput>;
    where?: Prisma.CharacterWhereInput;
    limit?: number;
};
export type CharacterUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CharacterUpdateManyMutationInput, Prisma.CharacterUncheckedUpdateManyInput>;
    where?: Prisma.CharacterWhereInput;
    limit?: number;
    include?: Prisma.CharacterIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CharacterUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    where: Prisma.CharacterWhereUniqueInput;
    create: Prisma.XOR<Prisma.CharacterCreateInput, Prisma.CharacterUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CharacterUpdateInput, Prisma.CharacterUncheckedUpdateInput>;
};
export type CharacterDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
    where: Prisma.CharacterWhereUniqueInput;
};
export type CharacterDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CharacterWhereInput;
    limit?: number;
};
export type CharacterDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CharacterSelect<ExtArgs> | null;
    omit?: Prisma.CharacterOmit<ExtArgs> | null;
    include?: Prisma.CharacterInclude<ExtArgs> | null;
};
export {};
