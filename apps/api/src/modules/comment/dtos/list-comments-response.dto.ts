import { ApiProperty } from '@nestjs/swagger';

class ListCommentsNextCursorDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;
}

class ListCommentsMetaDto {
  @ApiProperty({ nullable: true, type: ListCommentsNextCursorDto })
  nextCursor!: ListCommentsNextCursorDto | null;

  @ApiProperty()
  hasMore!: boolean;
}

export class CommentItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty()
  anonName!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ nullable: true })
  updatedAt!: Date | null;
}

export class ListCommentsResponseDto {
  @ApiProperty({ type: [CommentItemDto] })
  items!: CommentItemDto[];

  @ApiProperty()
  meta!: ListCommentsMetaDto;
}
