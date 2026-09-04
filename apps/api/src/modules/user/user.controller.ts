import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ErrorPath } from '../../common/consts/error-path.const';
import {
  AuthUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { SetErrorPath } from '../../common/decorators/set-error-path.decorator';
import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
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
  @ApiOkResponse({ type: UpdateUserResponseDto })
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    return this.userService.update(user.userId, {
      anonName: dto.anonName,
      currentPassword: dto.currentPassword,
      newPassword: dto.newPassword,
    });
  }
}
