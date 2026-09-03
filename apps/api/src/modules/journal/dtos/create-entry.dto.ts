import { ALL_JOURNAL_TAGS, type JournalTag } from '@repo/api-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
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

export class CreateEntryDto {
  @ApiProperty({ example: 'Today I feel ...' })
  @IsString()
  @MinLength(MIN_CONTENT_LENGTH)
  @MaxLength(MAX_CONTENT_LENGTH)
  content!: string;

  @ApiProperty({ example: 3 })
  @IsInt()
  @IsOptional()
  @Min(MIN_MOOD)
  @Max(MAX_MOOD)
  mood!: number;

  @ApiProperty({ example: ['therapy'] })
  @IsIn(ALL_JOURNAL_TAGS, { each: true })
  @IsOptional()
  tags!: JournalTag[];

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @IsOptional()
  publish?: boolean;
}
