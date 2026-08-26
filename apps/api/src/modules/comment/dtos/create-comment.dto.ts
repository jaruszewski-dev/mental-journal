import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

import {
  MAX_COMMENT_CONTENT_LENGTH,
  MIN_COMMENT_CONTENT_LENGTH,
} from '../consts/comment.const';

export class CreateCommentDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  postId!: string;

  @ApiProperty({ example: 'I hear you. You are not alone.' })
  @IsString()
  @MinLength(MIN_COMMENT_CONTENT_LENGTH)
  @MaxLength(MAX_COMMENT_CONTENT_LENGTH)
  content!: string;
}
