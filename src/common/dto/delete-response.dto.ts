import { ApiProperty } from '@nestjs/swagger';

export class DeleteResponseDto {
  @ApiProperty({
    example: true,
    description: 'The acknowledge field',
  })
  acknowledge: boolean;

  @ApiProperty({
    example: 1,
    description: 'The deleted count',
  })
  deletedCount: number;
}
