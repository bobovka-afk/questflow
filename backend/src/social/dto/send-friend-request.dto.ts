import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min } from 'class-validator';
import { FRIEND_CODE_MAX, FRIEND_CODE_MIN } from '../lib/friend-code';

export class SendFriendRequestDto {
  @ApiProperty({ example: 1492, minimum: FRIEND_CODE_MIN, maximum: FRIEND_CODE_MAX })
  @IsInt()
  @Min(FRIEND_CODE_MIN)
  @Max(FRIEND_CODE_MAX)
  friendCode!: number;
}
