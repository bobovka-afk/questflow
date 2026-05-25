import { User } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from '../auth/dto/register.dto';
import type { UserProfileView, UserPublic } from './interface';
export declare class UserService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getById(id: string): Promise<UserPublic | null>;
    findByEmail(email: string): Promise<User | null>;
    getProfileForViewer(targetUserId: number, viewerUserId: number): Promise<UserProfileView>;
    create(dto: RegisterDto): Promise<UserPublic>;
    createOAuthUser(email: string, name: string, picture: string): Promise<User>;
    updateAvatar(id: number, avatarPath: string): Promise<UserPublic>;
    removeAvatar(id: number): Promise<UserPublic>;
    updateName(id: number, name: string): Promise<UserPublic>;
    private normalizeEmail;
    private toUserPublic;
}
