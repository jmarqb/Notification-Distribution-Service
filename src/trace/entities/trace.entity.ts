import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { ProcessingTraceStatusEnum } from '../constants/processing-trace-status.enum';
import { Notification } from '../../notification/entities';
import { TraceMetaDataDto } from '../dto/trace-meta-data.dto';

@Schema()
export class Trace {
  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec680',
    description: 'The Trace id',
  })
  @Prop({ required: true, type: String })
  _id: string;

  @Prop({ required: true, type: String })
  description: string;

  @ApiProperty({
    example: 'FAIL',
    description: 'The notification processing status',
  })
  @Prop({
    type: String,
    required: true,
    index: true,
    enum: Object.values(ProcessingTraceStatusEnum),
  })
  processingStatus: ProcessingTraceStatusEnum;

  @ApiProperty({
    example: Notification,
  })
  @Prop({ type: TraceMetaDataDto, required: true })
  info: TraceMetaDataDto;
}

export const TraceSchema = SchemaFactory.createForClass(Trace);
TraceSchema.set('versionKey', false);
TraceSchema.set('timestamps', true);
