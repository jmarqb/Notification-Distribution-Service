import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTraceDto {
  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec681',
    description: 'The Trace id',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  _id: string;

  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec681',
    description: 'The notification id',
  })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  notification: string;

  @ApiProperty({
    example: 'Notification processed successfully',
    description: 'The notification process status',
  })
  @IsNotEmpty()
  @IsString()
  info: string;
}
