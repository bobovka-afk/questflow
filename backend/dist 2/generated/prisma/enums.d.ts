export declare const AuthTokenType: {
    readonly EMAIL_VERIFICATION: "EMAIL_VERIFICATION";
    readonly PASSWORD_RESET: "PASSWORD_RESET";
};
export type AuthTokenType = (typeof AuthTokenType)[keyof typeof AuthTokenType];
export declare const WorkspaceRole: {
    readonly ADMIN: "ADMIN";
    readonly OWNER: "OWNER";
    readonly MEMBER: "MEMBER";
};
export type WorkspaceRole = (typeof WorkspaceRole)[keyof typeof WorkspaceRole];
export declare const WorkspaceInviteStatus: {
    readonly PENDING: "PENDING";
    readonly ACCEPTED: "ACCEPTED";
    readonly DECLINED: "DECLINED";
    readonly EXPIRED: "EXPIRED";
};
export type WorkspaceInviteStatus = (typeof WorkspaceInviteStatus)[keyof typeof WorkspaceInviteStatus];
export declare const ListColorPreset: {
    readonly GREEN: "GREEN";
    readonly YELLOW: "YELLOW";
    readonly ORANGE: "ORANGE";
    readonly RED: "RED";
    readonly PURPLE: "PURPLE";
    readonly BLUE: "BLUE";
    readonly TEAL: "TEAL";
    readonly OLIVE: "OLIVE";
    readonly BROWN: "BROWN";
    readonly GRAY: "GRAY";
};
export type ListColorPreset = (typeof ListColorPreset)[keyof typeof ListColorPreset];
export declare const WorkspaceActivityType: {
    readonly WORKSPACE_CREATED: "WORKSPACE_CREATED";
    readonly WORKSPACE_UPDATED: "WORKSPACE_UPDATED";
    readonly MEMBER_INVITED: "MEMBER_INVITED";
    readonly INVITE_CANCELLED: "INVITE_CANCELLED";
    readonly INVITE_ACCEPTED: "INVITE_ACCEPTED";
    readonly INVITE_DECLINED: "INVITE_DECLINED";
    readonly MEMBER_REMOVED: "MEMBER_REMOVED";
    readonly MEMBER_LEFT: "MEMBER_LEFT";
};
export type WorkspaceActivityType = (typeof WorkspaceActivityType)[keyof typeof WorkspaceActivityType];
export declare const GenderCharacter: {
    readonly MALE: "MALE";
    readonly FEMALE: "FEMALE";
};
export type GenderCharacter = (typeof GenderCharacter)[keyof typeof GenderCharacter];
export declare const CharacterAvatarPreset: {
    readonly DRUID_MAN: "DRUID_MAN";
    readonly HUNTER_MAN: "HUNTER_MAN";
    readonly MAGE_MAN: "MAGE_MAN";
    readonly PALADIN_MAN: "PALADIN_MAN";
    readonly ROGUE_MAN: "ROGUE_MAN";
    readonly WARRIOR_MAN: "WARRIOR_MAN";
    readonly DRUID_WOMAN: "DRUID_WOMAN";
    readonly HUNTER_WOMAN: "HUNTER_WOMAN";
    readonly MAGE_WOMAN: "MAGE_WOMAN";
    readonly PALADIN_WOMAN: "PALADIN_WOMAN";
    readonly ROGUE_WOMAN: "ROGUE_WOMAN";
    readonly WARRIOR_WOMAN: "WARRIOR_WOMAN";
};
export type CharacterAvatarPreset = (typeof CharacterAvatarPreset)[keyof typeof CharacterAvatarPreset];
export declare const XpEventType: {
    readonly TASK_COMPLETED: "TASK_COMPLETED";
    readonly DAILY_CHECKIN: "DAILY_CHECKIN";
    readonly CHECKIN_STREAK: "CHECKIN_STREAK";
};
export type XpEventType = (typeof XpEventType)[keyof typeof XpEventType];
export declare const HealthEventReason: {
    readonly INACTIVITY_PENALTY: "INACTIVITY_PENALTY";
};
export type HealthEventReason = (typeof HealthEventReason)[keyof typeof HealthEventReason];
