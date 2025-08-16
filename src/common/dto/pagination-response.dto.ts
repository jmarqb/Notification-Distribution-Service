import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export class PaginationResponseDto<T> {
  @ApiProperty({
    example: [
      {
        id: 'c589e948-fb91-475c-9043-1b4c05bec680',
        name: 'Fluffy',
        deleted: false,
      },
    ],
    description: 'The list of items',
  })
  items: Array<HydratedDocument<T, {}, {}, {}>>;

  @ApiProperty({
    example: 10,
    description: 'The total number of items',
  })
  total: number;

  @ApiProperty({
    example: 1,
    description: 'The current page',
  })
  currentPage: number;

  @ApiProperty({
    example: 2,
    description: 'The total number of pages',
  })
  totalPages: number;
}
