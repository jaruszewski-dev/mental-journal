import { ApiProperty } from '@nestjs/swagger';

class ListFeedNextCursorDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  createdAt!: Date;
}

class ListFeedMetaDto {
  @ApiProperty({ nullable: true, type: ListFeedNextCursorDto })
  nextCursor!: ListFeedNextCursorDto | null;

  @ApiProperty()
  hasMore!: boolean;
}

export class FeedItemDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  content!: string;

  @ApiProperty({ required: false })
  mood?: number;

  @ApiProperty()
  tags!: string[];

  @ApiProperty({ enum: ['ACTIVE', 'PENDING'] })
  status!: 'ACTIVE' | 'PENDING';

  @ApiProperty()
  anonName!: string;

  @ApiProperty({ nullable: true })
  avatarUrl!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty({ nullable: true })
  updatedAt!: Date | null;
}

export class ListFeedResponseDto {
  @ApiProperty({ type: [FeedItemDto] })
  items!: FeedItemDto[];

  @ApiProperty()
  meta!: ListFeedMetaDto;
}
