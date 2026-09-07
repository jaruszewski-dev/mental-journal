import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { FeedItemDto } from '../../feed/dtos/list-feed-response.dto';

export class CreateEntryResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ type: FeedItemDto })
  post?: FeedItemDto;
}
