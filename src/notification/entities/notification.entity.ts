import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryChannel, NotificationType } from '../constants';
import { MetadataSchema } from './metadata.schema';

@Schema()
export class Notification {
  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec680',
    description: 'The notification id',
  })
  @Prop({ required: true, type: String })
  _id: string;

  @ApiProperty({
    example: '2023-10-23T10:15:30Z',
    description: 'Date the notification was created',
  })
  @Prop({ index: true, type: Date, required: false, default: Date.now })
  dateEmitted: Date;

  @ApiProperty({
    example: 'EVENT_OCURRED',
    description: 'Name of the event that triggered the notification',
  })
  @Prop({ required: true, type: String })
  eventEmitted: string;

  @ApiProperty({
    example: 'EMAIL',
    description: 'The method used to deliver the notification, EMAIL or SYSTEM',
    enum: Object.values(DeliveryChannel),
  })
  @Prop({
    index: true,
    required: true,
    type: String,
    enum: Object.values(DeliveryChannel),
  })
  deliveryChannel: DeliveryChannel;

  @ApiProperty({
    example: 'BATCH',
    description: 'Type of the notification, BATCH or INSTANT',
    enum: Object.values(NotificationType),
  })
  @Prop({
    index: true,
    required: true,
    type: String,
    enum: Object.values(NotificationType),
  })
  notificationType: NotificationType;

  @ApiProperty({
    example: MetadataSchema,
    type: MetadataSchema,
  })
  @Prop({ required: true, type: MetadataSchema })
  metadata: MetadataSchema;

  @ApiProperty()
  @Prop({ index: true, type: Boolean, required: false, default: false })
  read: boolean;

  @ApiProperty()
  @Prop({ index: true, type: Boolean, required: false, default: false })
  deleted: boolean;

  @ApiProperty()
  @Prop({ index: true, type: Date, required: false })
  deletedAt?: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
NotificationSchema.set('versionKey', false);
NotificationSchema.set('timestamps', true);
