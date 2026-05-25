import type { UserPublic, UserProfileView } from './interface';
import type { AuthedRequest } from '../common/type';
import type { File as MulterFile } from 'multer';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: AuthedRequest): Promise<UserPublic | null>;
    getUserProfile(req: AuthedRequest, userId: number): Promise<UserProfileView>;
    updateProfile(req: AuthedRequest, body: UpdateUserDto): Promise<UserPublic>;
    updateAvatar(req: AuthedRequest, file?: MulterFile): Promise<UserPublic>;
    removeAvatar(req: AuthedRequest): Promise<UserPublic>;
}
