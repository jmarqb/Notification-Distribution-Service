import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema()
export class Trace {
  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec680',
    description: 'The Trace id',
  })
  @Prop({ required: true, type: String })
  _id: string;

  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec681',
    description: 'The notification id',
  })
  @Prop({ type: String, ref: 'Notification', required: true })
  notification: string;

  @ApiProperty({
    example: 'Notification processed successfully',
    description: 'The notification process status',
  })
  @Prop({ type: String, required: true })
  info: string;
}
export const TraceSchema = SchemaFactory.createForClass(Trace);
TraceSchema.set('versionKey', false);
TraceSchema.set('timestamps', true);
