import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ErrorPath } from '../../common/consts/error-path.const';
import {
  AuthUser,
  CurrentUser,
} from '../../common/decorators/current-user.decorator';
import { SetErrorPath } from '../../common/decorators/set-error-path.decorator';
import { AccountCanActGuard } from '../../common/guards/account-can-act.guard';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { CreateCommentResponseDto } from './dtos/create-comment-response.dto';
import { DeleteCommentResponseDto } from './dtos/delete-comment-response.dto';
import { ListCommentsQueryDto } from './dtos/list-comments-query.dto';
import { ListCommentsResponseDto } from './dtos/list-comments-response.dto';

@SetErrorPath(ErrorPath.COMMENT)
@UseGuards(JwtAuthGuard, AccountCanActGuard)
@Controller('comments')
@ApiTags('Comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateCommentDto,
  ): Promise<CreateCommentResponseDto> {
    return this.commentService.create(dto, user.userId);
  }

  @Get()
  findAll(
    @Query() dto: ListCommentsQueryDto,
  ): Promise<ListCommentsResponseDto> {
    return this.commentService.findAll(dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(
    @Param('id', ParseUUIDPipe) commentId: string,
    @CurrentUser() user: AuthUser,
  ): Promise<DeleteCommentResponseDto> {
    return this.commentService.delete(commentId, user.userId);
  }
}
