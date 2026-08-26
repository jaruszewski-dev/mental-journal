import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';

export class ListCommentsQueryDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  postId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastCursorId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastCreatedAt?: Date;
}
