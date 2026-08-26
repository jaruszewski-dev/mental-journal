import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentResponseDto {
  @ApiProperty()
  id!: string;
}
