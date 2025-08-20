import { Prop, Schema } from '@nestjs/mongoose';
import {
  DeliveryChannel,
  NotificationType,
} from '../../notification/constants';
import { User } from '../../auth/entities/user.entity';

@Schema({ _id: false })
export class TraceMetaDataSchema {
  @Prop({ required: true, type: String })
  eventEmitted: string;

  @Prop({
    index: true,
    required: true,
    type: String,
    enum: Object.values(DeliveryChannel),
  })
  deliveryChannel: DeliveryChannel;
  @Prop({
    index: true,
    required: true,
    type: String,
    enum: Object.values(NotificationType),
  })
  notificationType: NotificationType;

  @Prop({
    type: String,
    required: false,
  })
  email?: string;

  @Prop({ required: false, type: String, ref: User.name })
  userId?: string;
}
