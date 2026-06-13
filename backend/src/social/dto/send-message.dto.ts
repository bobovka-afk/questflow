import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { DIRECT_MESSAGE_BODY_MAX_LENGTH } from '../constants';

export class SendMessageDto {
  @ApiProperty({ example: 'Hello!' })
  @IsString()
  @MinLength(1)
  @MaxLength(DIRECT_MESSAGE_BODY_MAX_LENGTH)
  body!: string;
}
