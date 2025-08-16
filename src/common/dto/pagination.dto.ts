import { IsOptional, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 10;
}
