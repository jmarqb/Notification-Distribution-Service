import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../auth/entities/user.entity';

@Schema({ _id: false })
export class MetadataSchema {
  @ApiProperty({
    example: 'jonhdoe@gmail.com',
    description: 'email address',
    type: String,
  })
  @Prop({
    type: String,
    required: false,
  })
  email?: string;

  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec680',
    description: 'userUID to whom the notification is addressed',
    type: String,
  })
  @Prop({ required: false, type: String, ref: User.name })
  userId?: string;

  @ApiProperty({
    example: 'Notification information',
    description: 'Notification information description',
    type: String,
  })
  @Prop({
    required: true,
    type: String,
  })
  content: string;
}
