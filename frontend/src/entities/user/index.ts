export { updateUsername, type UserMeDto } from './api/userApi';
export {
  avatarInitials,
  avatarSrcFromPath,
  userCharacterPath,
  userProfilePath,
} from './lib/avatar';
export { activityUserDisplayName, type ActivityUserBrief } from './lib/activityUser';
export { isValidUsername, normalizeUsername, profilePathForUsername } from './lib/username';
