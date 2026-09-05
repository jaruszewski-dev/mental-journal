import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  Allow,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';

import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
} from '../../auth/consts/password.const';
import {
  ANON_NAME_MAX_LENGTH,
  ANON_NAME_MIN_LENGTH,
  ANON_NAME_REGEX,
} from '../consts/anon-name.const';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'CichyWiatr' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(ANON_NAME_MIN_LENGTH)
  @MaxLength(ANON_NAME_MAX_LENGTH)
  @Matches(ANON_NAME_REGEX, {
    message: 'anonName: must be 3–24 chars with letters, digits or underscore',
  })
  anonName?: string;

  @ApiPropertyOptional({ example: 'OldPass123!' })
  @ValidateIf((dto: UpdateUserDto) => dto.newPassword !== undefined)
  @IsString()
  @IsNotEmpty()
  currentPassword?: string;

  @ApiPropertyOptional({ example: 'StrongPass123!' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(PASSWORD_MIN_LENGTH)
  @MaxLength(PASSWORD_MAX_LENGTH)
  @Matches(PASSWORD_REGEX, {
    message:
      'newPassword: must be 8–72 chars with upper, lower, digit and special char',
  })
  newPassword?: string;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  @Allow()
  avatar?: unknown;
}
