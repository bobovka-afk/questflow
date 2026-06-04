import {
  Body,
  Controller,
  Get,
  Delete,
  Patch,
  Post,
  Param,
  ParseIntPipe,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';
import type { Request } from 'express';
import type { UserPublic, UserProfileView } from './interface';
import type { AuthedRequest } from '../common/type';
import type { File as MulterFile } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UserService } from './user.service';
import { UserEmailChangeService } from './user-email-change.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUsernameDto } from './dto/update-username.dto';
import { RequestEmailChangeDto } from './dto/request-email-change.dto';
import { DeleteAccountDto } from './dto/delete-account.dto';
import { clientIpFromForwarded } from '../user-settings/lib/settings-json';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { RateLimit } from '../common/decorators/rate-limit.decorator';
import { RateLimitGuard } from '../common/guards/rate-limit.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import sharp from 'sharp';

function sessionMetaFromRequest(req: Request) {
  const userAgent = req.headers['user-agent'];
  const ipAddress =
    clientIpFromForwarded(req.headers['x-forwarded-for']) ??
    req.ip ??
    req.socket.remoteAddress ??
    undefined;
  return {
    userAgent: typeof userAgent === 'string' ? userAgent : undefined,
    ipAddress,
  };
}

@ApiTags('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userEmailChangeService: UserEmailChangeService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile returned successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  async getProfile(@Req() req: AuthedRequest): Promise<UserPublic | null> {
    return this.userService.getById(String(req.user.id));
  }

  @Get('profile/:userId')
  @ApiOperation({ summary: 'Get another user profile (shared workspace required)' })
  @ApiResponse({ status: 200, description: 'Public user profile returned successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 403, description: "code: 'ACCESS_DENIED'" })
  @ApiResponse({ status: 404, description: "code: 'USER_NOT_FOUND'" })
  async getUserProfile(
    @Req() req: AuthedRequest,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserProfileView> {
    return this.userService.getProfileForViewer(userId, req.user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto, description: 'User profile update payload' })
  @ApiResponse({ status: 200, description: 'Current user profile updated successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  async updateProfile(
    @Req() req: AuthedRequest,
    @Body() body: UpdateUserDto,
  ): Promise<UserPublic> {
    return this.userService.updateName(req.user.id, body.name);
  }

  @Patch('me/username')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'user:username', limit: 5, windowSec: 300 })
  @ApiOperation({ summary: 'Set public @username for profile links' })
  async updateUsername(
    @Req() req: AuthedRequest,
    @Body() body: UpdateUsernameDto,
  ): Promise<UserPublic> {
    return this.userService.updateUsername(req.user.id, body.username);
  }

  @Patch('update-avatar')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'user:update-avatar', limit: 10, windowSec: 300 })
  @ApiOperation({ summary: 'Upload and update user avatar' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Avatar image file',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => {
          const dir = path.join(process.cwd(), 'uploads', 'user-avatars');
          fs.mkdirSync(dir, { recursive: true });
          cb(null, dir);
        },
        filename: (req, _file, cb) => {
          const userId = (req as any).user?.id ?? 'anon';
          const name = `${userId}-${Date.now()}-${randomUUID()}.upload`;
          cb(null, name);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, 
      fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(
            new BadRequestException({
              code: 'IMAGE_FILE_REQUIRED',
              message: 'Only image files are allowed',
            }),
            false,
          );
        }
        cb(null, true);
      },
    }),
  )
  @ApiResponse({ status: 200, description: 'User avatar updated successfully.' })
  @ApiResponse({ status: 400, description: "code: 'IMAGE_FILE_REQUIRED'" })
  @ApiResponse({ status: 400, description: "code: 'FILE_NOT_PROVIDED'" })
  @ApiResponse({ status: 400, description: "code: 'IMAGE_FILE_INVALID'" })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  @ApiResponse({ status: 429, description: "code: 'RATE_LIMIT_EXCEEDED'" })
  async updateAvatar(
    @Req() req: AuthedRequest,
    @UploadedFile() file?: MulterFile,
  ): Promise<UserPublic> {
    if (!file) {
      throw new BadRequestException({
        code: 'FILE_NOT_PROVIDED',
        message: 'File is not provided',
      });
    }

    const uploadDir = path.join(process.cwd(), 'uploads', 'user-avatars');
    const finalFilename = `${req.user.id}-${Date.now()}-${randomUUID()}.png`;
    const finalPath = path.join(uploadDir, finalFilename);
    const tempPath = file.path;

    try {
      await sharp(tempPath)
        .rotate()
        .resize(256, 256, { fit: 'cover', position: 'centre' })
        .png({ compressionLevel: 9, palette: true, effort: 10 })
        .toFile(finalPath);
    } catch (_error) {
      throw new BadRequestException({
        code: 'IMAGE_FILE_INVALID',
        message: 'Image file is invalid or unsupported',
      });
    } finally {
      if (tempPath) {
        fs.rmSync(tempPath, { force: true });
      }
    }

    const baseUrl = process.env.SERVER_URL ?? 'http://localhost:3000';
    const avatarUrl = `${baseUrl}/uploads/user-avatars/${finalFilename}`;
    return this.userService.updateAvatar(req.user.id, avatarUrl);
  }

  @Post('me/email-change/request')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'user:email-change', limit: 3, windowSec: 300 })
  @HttpCode(200)
  @ApiOperation({ summary: 'Request email change (confirm old + new inbox)' })
  requestEmailChange(
    @Req() req: AuthedRequest & Request,
    @Body() body: RequestEmailChangeDto,
  ) {
    return this.userEmailChangeService.requestChange(
      req.user.id,
      body.newEmail,
      body.currentPassword,
      sessionMetaFromRequest(req),
    );
  }

  @Get('me/email-change/pending')
  @ApiOperation({ summary: 'Pending email change status' })
  getPendingEmailChange(@Req() req: AuthedRequest) {
    return this.userEmailChangeService.getPendingStatus(req.user.id);
  }

  @Delete('me')
  @UseGuards(RateLimitGuard)
  @RateLimit({ key: 'user:delete-account', limit: 3, windowSec: 300 })
  @ApiOperation({ summary: 'Delete current user account' })
  deleteAccount(@Req() req: AuthedRequest, @Body() body: DeleteAccountDto) {
    return this.userService.deleteAccount(
      req.user.id,
      body.password,
      body.confirmPhrase,
    );
  }

  @Delete('remove-avatar')
  @ApiOperation({ summary: 'Remove current user avatar' })
  @ApiResponse({ status: 200, description: 'User avatar removed successfully.' })
  @ApiResponse({ status: 401, description: "code: 'UNAUTHORIZED'" })
  async removeAvatar(
    @Req() req: AuthedRequest,
  ): Promise<UserPublic> {
    return this.userService.removeAvatar(req.user.id);
  }
}

