import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class AddCardAttachmentLinkDto {
  @ApiProperty({ example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' })
  @IsString()
  @IsUrl({ require_protocol: true, protocols: ['http', 'https'] })
  @MaxLength(2048)
  url!: string;

  @ApiProperty({ required: false, example: 'Demo video' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  fileName?: string;
}
