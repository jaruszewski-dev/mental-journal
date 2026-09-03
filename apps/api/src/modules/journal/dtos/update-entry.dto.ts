import { ALL_JOURNAL_TAGS, type JournalTag } from '@repo/api-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

import {
  MAX_CONTENT_LENGTH,
  MAX_MOOD,
  MIN_CONTENT_LENGTH,
  MIN_MOOD,
} from '../consts/entry.const';

export class UpdateEntryDto {
  @ApiProperty()
  @IsString()
  @MinLength(MIN_CONTENT_LENGTH)
  @MaxLength(MAX_CONTENT_LENGTH)
  @IsOptional()
  content?: string;

  @ApiProperty()
  @IsInt()
  @Min(MIN_MOOD)
  @Max(MAX_MOOD)
  @IsOptional()
  mood?: number;

  @ApiProperty()
  @IsIn(ALL_JOURNAL_TAGS, { each: true })
  @IsOptional()
  tags?: JournalTag[];
}
