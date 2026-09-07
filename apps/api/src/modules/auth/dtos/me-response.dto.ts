import { ApiProperty } from '@nestjs/swagger';

export class MeResponseDto {
  @ApiProperty({ example: '40872a11-e023-4ce0-817e-80245d5dc735' })
  userId!: string;

  @ApiProperty({ example: 'CichyWiatr' })
  anonName!: string;

  @ApiProperty({ nullable: true, example: null })
  avatarUrl!: string | null;
}
