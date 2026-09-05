import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ErrorPath } from '../../common/consts/error-path.const';
import {
  AuthUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { SetErrorPath } from '../../common/decorators/set-error-path.decorator';
import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AVATAR_MAX_BYTES } from '../storage/consts/avatar.const';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UpdateUserResponseDto } from './dtos/update-user-response.dto';
import { UserService } from './user.service';

@SetErrorPath(ErrorPath.USER)
@UseGuards(JwtAuthGuard, AccountCanActGuard)
@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: UpdateUserResponseDto })
  @UseInterceptors(
    FileInterceptor('avatar', {
      limits: { fileSize: AVATAR_MAX_BYTES },
    }),
  )
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.update(user.userId, {
      anonName: dto.anonName,
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
      avatar: avatar
        ? { buffer: avatar.buffer, mimeType: avatar.mimetype }
        : undefined,
    });
  }
}
