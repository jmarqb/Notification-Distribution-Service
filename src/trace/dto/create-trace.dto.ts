import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ProcessingTraceStatusEnum } from '../constants/processing-trace-status.enum';
import { Notification } from '../../notification/entities';
import { TraceMetaDataDto } from './trace-meta-data.dto';

export class CreateTraceDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  _id: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ProcessingTraceStatusEnum)
  @IsString()
  processingStatus: ProcessingTraceStatusEnum;

  @ApiProperty({
    example: Notification,
  })
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  info: TraceMetaDataDto;
}
