"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthEventReason = exports.XpEventType = exports.CharacterAvatarPreset = exports.GenderCharacter = exports.WorkspaceActivityType = exports.ListColorPreset = exports.WorkspaceInviteStatus = exports.WorkspaceRole = exports.AuthTokenType = void 0;
exports.AuthTokenType = {
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
    PASSWORD_RESET: 'PASSWORD_RESET'
};
exports.WorkspaceRole = {
    ADMIN: 'ADMIN',
    OWNER: 'OWNER',
    MEMBER: 'MEMBER'
};
exports.WorkspaceInviteStatus = {
    PENDING: 'PENDING',
    ACCEPTED: 'ACCEPTED',
    DECLINED: 'DECLINED',
    EXPIRED: 'EXPIRED'
};
exports.ListColorPreset = {
    GREEN: 'GREEN',
    YELLOW: 'YELLOW',
    ORANGE: 'ORANGE',
    RED: 'RED',
    PURPLE: 'PURPLE',
    BLUE: 'BLUE',
    TEAL: 'TEAL',
    OLIVE: 'OLIVE',
    BROWN: 'BROWN',
    GRAY: 'GRAY'
};
exports.WorkspaceActivityType = {
    WORKSPACE_CREATED: 'WORKSPACE_CREATED',
    WORKSPACE_UPDATED: 'WORKSPACE_UPDATED',
    MEMBER_INVITED: 'MEMBER_INVITED',
    INVITE_CANCELLED: 'INVITE_CANCELLED',
    INVITE_ACCEPTED: 'INVITE_ACCEPTED',
    INVITE_DECLINED: 'INVITE_DECLINED',
    MEMBER_REMOVED: 'MEMBER_REMOVED',
    MEMBER_LEFT: 'MEMBER_LEFT'
};
exports.GenderCharacter = {
    MALE: 'MALE',
    FEMALE: 'FEMALE'
};
exports.CharacterAvatarPreset = {
    DRUID_MAN: 'DRUID_MAN',
    HUNTER_MAN: 'HUNTER_MAN',
    MAGE_MAN: 'MAGE_MAN',
    PALADIN_MAN: 'PALADIN_MAN',
    ROGUE_MAN: 'ROGUE_MAN',
    WARRIOR_MAN: 'WARRIOR_MAN',
    DRUID_WOMAN: 'DRUID_WOMAN',
    HUNTER_WOMAN: 'HUNTER_WOMAN',
    MAGE_WOMAN: 'MAGE_WOMAN',
    PALADIN_WOMAN: 'PALADIN_WOMAN',
    ROGUE_WOMAN: 'ROGUE_WOMAN',
    WARRIOR_WOMAN: 'WARRIOR_WOMAN'
};
exports.XpEventType = {
    TASK_COMPLETED: 'TASK_COMPLETED',
    DAILY_CHECKIN: 'DAILY_CHECKIN',
    CHECKIN_STREAK: 'CHECKIN_STREAK'
};
exports.HealthEventReason = {
    INACTIVITY_PENALTY: 'INACTIVITY_PENALTY'
};
//# sourceMappingURL=enums.js.map