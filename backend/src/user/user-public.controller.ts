import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('user')
@Controller('user/public')
export class UserPublicController {
  constructor(private readonly userService: UserService) {}

  @Get('username/:username')
  @ApiOperation({ summary: 'Resolve public username to user id (for profile links)' })
  @ApiParam({ name: 'username', example: 'hero_42' })
  @ApiResponse({ status: 200, description: 'User id returned.' })
  @ApiResponse({ status: 404, description: "code: 'USERNAME_NOT_FOUND'" })
  async resolveUsername(@Param('username') username: string) {
    const resolved = await this.userService.resolveUsername(username);
    if (!resolved) {
      throw new NotFoundException({
        code: 'USERNAME_NOT_FOUND',
        message: 'Username not found',
      });
    }
    return resolved;
  }
}
