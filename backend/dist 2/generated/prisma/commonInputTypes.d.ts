import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums";
import type * as Prisma from "./internal/prismaNamespace";
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type EnumAuthTokenTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthTokenType | Prisma.EnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AuthTokenType[] | Prisma.ListEnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AuthTokenType[] | Prisma.ListEnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAuthTokenTypeFilter<$PrismaModel> | $Enums.AuthTokenType;
};
export type EnumAuthTokenTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthTokenType | Prisma.EnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AuthTokenType[] | Prisma.ListEnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AuthTokenType[] | Prisma.ListEnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAuthTokenTypeWithAggregatesFilter<$PrismaModel> | $Enums.AuthTokenType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAuthTokenTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAuthTokenTypeFilter<$PrismaModel>;
};
export type EnumWorkspaceRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceRole | Prisma.EnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceRole[] | Prisma.ListEnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceRole[] | Prisma.ListEnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceRoleFilter<$PrismaModel> | $Enums.WorkspaceRole;
};
export type EnumWorkspaceRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceRole | Prisma.EnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceRole[] | Prisma.ListEnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceRole[] | Prisma.ListEnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceRoleWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceRoleFilter<$PrismaModel>;
};
export type EnumWorkspaceInviteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceInviteStatus | Prisma.EnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceInviteStatus[] | Prisma.ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceInviteStatus[] | Prisma.ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceInviteStatusFilter<$PrismaModel> | $Enums.WorkspaceInviteStatus;
};
export type EnumWorkspaceInviteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceInviteStatus | Prisma.EnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceInviteStatus[] | Prisma.ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceInviteStatus[] | Prisma.ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceInviteStatusWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceInviteStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceInviteStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceInviteStatusFilter<$PrismaModel>;
};
export type EnumWorkspaceActivityTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceActivityType | Prisma.EnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceActivityType[] | Prisma.ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceActivityType[] | Prisma.ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceActivityTypeFilter<$PrismaModel> | $Enums.WorkspaceActivityType;
};
export type JsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>, Required<JsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;
export type JsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type EnumWorkspaceActivityTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceActivityType | Prisma.EnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceActivityType[] | Prisma.ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceActivityType[] | Prisma.ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceActivityTypeWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceActivityType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceActivityTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceActivityTypeFilter<$PrismaModel>;
};
export type JsonWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonFilter<$PrismaModel>;
};
export type EnumListColorPresetFilter<$PrismaModel = never> = {
    equals?: $Enums.ListColorPreset | Prisma.EnumListColorPresetFieldRefInput<$PrismaModel>;
    in?: $Enums.ListColorPreset[] | Prisma.ListEnumListColorPresetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListColorPreset[] | Prisma.ListEnumListColorPresetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListColorPresetFilter<$PrismaModel> | $Enums.ListColorPreset;
};
export type EnumListColorPresetWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListColorPreset | Prisma.EnumListColorPresetFieldRefInput<$PrismaModel>;
    in?: $Enums.ListColorPreset[] | Prisma.ListEnumListColorPresetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListColorPreset[] | Prisma.ListEnumListColorPresetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListColorPresetWithAggregatesFilter<$PrismaModel> | $Enums.ListColorPreset;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListColorPresetFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListColorPresetFilter<$PrismaModel>;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type EnumGenderCharacterFilter<$PrismaModel = never> = {
    equals?: $Enums.GenderCharacter | Prisma.EnumGenderCharacterFieldRefInput<$PrismaModel>;
    in?: $Enums.GenderCharacter[] | Prisma.ListEnumGenderCharacterFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GenderCharacter[] | Prisma.ListEnumGenderCharacterFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGenderCharacterFilter<$PrismaModel> | $Enums.GenderCharacter;
};
export type EnumCharacterAvatarPresetFilter<$PrismaModel = never> = {
    equals?: $Enums.CharacterAvatarPreset | Prisma.EnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    in?: $Enums.CharacterAvatarPreset[] | Prisma.ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CharacterAvatarPreset[] | Prisma.ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCharacterAvatarPresetFilter<$PrismaModel> | $Enums.CharacterAvatarPreset;
};
export type EnumGenderCharacterWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GenderCharacter | Prisma.EnumGenderCharacterFieldRefInput<$PrismaModel>;
    in?: $Enums.GenderCharacter[] | Prisma.ListEnumGenderCharacterFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GenderCharacter[] | Prisma.ListEnumGenderCharacterFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGenderCharacterWithAggregatesFilter<$PrismaModel> | $Enums.GenderCharacter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGenderCharacterFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGenderCharacterFilter<$PrismaModel>;
};
export type EnumCharacterAvatarPresetWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CharacterAvatarPreset | Prisma.EnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    in?: $Enums.CharacterAvatarPreset[] | Prisma.ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CharacterAvatarPreset[] | Prisma.ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCharacterAvatarPresetWithAggregatesFilter<$PrismaModel> | $Enums.CharacterAvatarPreset;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCharacterAvatarPresetFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCharacterAvatarPresetFilter<$PrismaModel>;
};
export type EnumXpEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.XpEventType | Prisma.EnumXpEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.XpEventType[] | Prisma.ListEnumXpEventTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.XpEventType[] | Prisma.ListEnumXpEventTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumXpEventTypeFilter<$PrismaModel> | $Enums.XpEventType;
};
export type EnumXpEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.XpEventType | Prisma.EnumXpEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.XpEventType[] | Prisma.ListEnumXpEventTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.XpEventType[] | Prisma.ListEnumXpEventTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumXpEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.XpEventType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumXpEventTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumXpEventTypeFilter<$PrismaModel>;
};
export type EnumHealthEventReasonFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthEventReason | Prisma.EnumHealthEventReasonFieldRefInput<$PrismaModel>;
    in?: $Enums.HealthEventReason[] | Prisma.ListEnumHealthEventReasonFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HealthEventReason[] | Prisma.ListEnumHealthEventReasonFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHealthEventReasonFilter<$PrismaModel> | $Enums.HealthEventReason;
};
export type EnumHealthEventReasonWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthEventReason | Prisma.EnumHealthEventReasonFieldRefInput<$PrismaModel>;
    in?: $Enums.HealthEventReason[] | Prisma.ListEnumHealthEventReasonFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HealthEventReason[] | Prisma.ListEnumHealthEventReasonFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHealthEventReasonWithAggregatesFilter<$PrismaModel> | $Enums.HealthEventReason;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumHealthEventReasonFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumHealthEventReasonFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedEnumAuthTokenTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthTokenType | Prisma.EnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AuthTokenType[] | Prisma.ListEnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AuthTokenType[] | Prisma.ListEnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAuthTokenTypeFilter<$PrismaModel> | $Enums.AuthTokenType;
};
export type NestedEnumAuthTokenTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AuthTokenType | Prisma.EnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.AuthTokenType[] | Prisma.ListEnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.AuthTokenType[] | Prisma.ListEnumAuthTokenTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumAuthTokenTypeWithAggregatesFilter<$PrismaModel> | $Enums.AuthTokenType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAuthTokenTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAuthTokenTypeFilter<$PrismaModel>;
};
export type NestedEnumWorkspaceRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceRole | Prisma.EnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceRole[] | Prisma.ListEnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceRole[] | Prisma.ListEnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceRoleFilter<$PrismaModel> | $Enums.WorkspaceRole;
};
export type NestedEnumWorkspaceRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceRole | Prisma.EnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceRole[] | Prisma.ListEnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceRole[] | Prisma.ListEnumWorkspaceRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceRoleWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceRoleFilter<$PrismaModel>;
};
export type NestedEnumWorkspaceInviteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceInviteStatus | Prisma.EnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceInviteStatus[] | Prisma.ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceInviteStatus[] | Prisma.ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceInviteStatusFilter<$PrismaModel> | $Enums.WorkspaceInviteStatus;
};
export type NestedEnumWorkspaceInviteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceInviteStatus | Prisma.EnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceInviteStatus[] | Prisma.ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceInviteStatus[] | Prisma.ListEnumWorkspaceInviteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceInviteStatusWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceInviteStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceInviteStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceInviteStatusFilter<$PrismaModel>;
};
export type NestedEnumWorkspaceActivityTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceActivityType | Prisma.EnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceActivityType[] | Prisma.ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceActivityType[] | Prisma.ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceActivityTypeFilter<$PrismaModel> | $Enums.WorkspaceActivityType;
};
export type NestedEnumWorkspaceActivityTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.WorkspaceActivityType | Prisma.EnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.WorkspaceActivityType[] | Prisma.ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.WorkspaceActivityType[] | Prisma.ListEnumWorkspaceActivityTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumWorkspaceActivityTypeWithAggregatesFilter<$PrismaModel> | $Enums.WorkspaceActivityType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumWorkspaceActivityTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumWorkspaceActivityTypeFilter<$PrismaModel>;
};
export type NestedJsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedEnumListColorPresetFilter<$PrismaModel = never> = {
    equals?: $Enums.ListColorPreset | Prisma.EnumListColorPresetFieldRefInput<$PrismaModel>;
    in?: $Enums.ListColorPreset[] | Prisma.ListEnumListColorPresetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListColorPreset[] | Prisma.ListEnumListColorPresetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListColorPresetFilter<$PrismaModel> | $Enums.ListColorPreset;
};
export type NestedEnumListColorPresetWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ListColorPreset | Prisma.EnumListColorPresetFieldRefInput<$PrismaModel>;
    in?: $Enums.ListColorPreset[] | Prisma.ListEnumListColorPresetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ListColorPreset[] | Prisma.ListEnumListColorPresetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumListColorPresetWithAggregatesFilter<$PrismaModel> | $Enums.ListColorPreset;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumListColorPresetFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumListColorPresetFilter<$PrismaModel>;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedEnumGenderCharacterFilter<$PrismaModel = never> = {
    equals?: $Enums.GenderCharacter | Prisma.EnumGenderCharacterFieldRefInput<$PrismaModel>;
    in?: $Enums.GenderCharacter[] | Prisma.ListEnumGenderCharacterFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GenderCharacter[] | Prisma.ListEnumGenderCharacterFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGenderCharacterFilter<$PrismaModel> | $Enums.GenderCharacter;
};
export type NestedEnumCharacterAvatarPresetFilter<$PrismaModel = never> = {
    equals?: $Enums.CharacterAvatarPreset | Prisma.EnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    in?: $Enums.CharacterAvatarPreset[] | Prisma.ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CharacterAvatarPreset[] | Prisma.ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCharacterAvatarPresetFilter<$PrismaModel> | $Enums.CharacterAvatarPreset;
};
export type NestedEnumGenderCharacterWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GenderCharacter | Prisma.EnumGenderCharacterFieldRefInput<$PrismaModel>;
    in?: $Enums.GenderCharacter[] | Prisma.ListEnumGenderCharacterFieldRefInput<$PrismaModel>;
    notIn?: $Enums.GenderCharacter[] | Prisma.ListEnumGenderCharacterFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumGenderCharacterWithAggregatesFilter<$PrismaModel> | $Enums.GenderCharacter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumGenderCharacterFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumGenderCharacterFilter<$PrismaModel>;
};
export type NestedEnumCharacterAvatarPresetWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CharacterAvatarPreset | Prisma.EnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    in?: $Enums.CharacterAvatarPreset[] | Prisma.ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CharacterAvatarPreset[] | Prisma.ListEnumCharacterAvatarPresetFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCharacterAvatarPresetWithAggregatesFilter<$PrismaModel> | $Enums.CharacterAvatarPreset;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCharacterAvatarPresetFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCharacterAvatarPresetFilter<$PrismaModel>;
};
export type NestedEnumXpEventTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.XpEventType | Prisma.EnumXpEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.XpEventType[] | Prisma.ListEnumXpEventTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.XpEventType[] | Prisma.ListEnumXpEventTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumXpEventTypeFilter<$PrismaModel> | $Enums.XpEventType;
};
export type NestedEnumXpEventTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.XpEventType | Prisma.EnumXpEventTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.XpEventType[] | Prisma.ListEnumXpEventTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.XpEventType[] | Prisma.ListEnumXpEventTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumXpEventTypeWithAggregatesFilter<$PrismaModel> | $Enums.XpEventType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumXpEventTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumXpEventTypeFilter<$PrismaModel>;
};
export type NestedEnumHealthEventReasonFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthEventReason | Prisma.EnumHealthEventReasonFieldRefInput<$PrismaModel>;
    in?: $Enums.HealthEventReason[] | Prisma.ListEnumHealthEventReasonFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HealthEventReason[] | Prisma.ListEnumHealthEventReasonFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHealthEventReasonFilter<$PrismaModel> | $Enums.HealthEventReason;
};
export type NestedEnumHealthEventReasonWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.HealthEventReason | Prisma.EnumHealthEventReasonFieldRefInput<$PrismaModel>;
    in?: $Enums.HealthEventReason[] | Prisma.ListEnumHealthEventReasonFieldRefInput<$PrismaModel>;
    notIn?: $Enums.HealthEventReason[] | Prisma.ListEnumHealthEventReasonFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumHealthEventReasonWithAggregatesFilter<$PrismaModel> | $Enums.HealthEventReason;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumHealthEventReasonFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumHealthEventReasonFilter<$PrismaModel>;
};
