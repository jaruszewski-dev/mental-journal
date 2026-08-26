import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentResponseDto {
  @ApiProperty()
  id!: string;
}
