import {
  IsDefined,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DeliveryChannel, NotificationType } from '../constants';
import { IsUserExist } from '../decorators';
import { Transform } from 'class-transformer';

export class CreateNotificationDto {
  @IsOptional()
  _id?: string;

  @ApiProperty({
    example: 'EVENT_OCURRED',
    description: 'Name of the event that triggered the notification',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toUpperCase())
  eventEmitted: string;

  @ApiProperty({
    enum: ['Email', 'System'],
    example: DeliveryChannel.Email,
    description: 'The method chosen to deliver the notification',
  })
  @IsNotEmpty()
  @IsEnum(DeliveryChannel)
  deliveryChannel: DeliveryChannel;

  @ApiProperty({
    enum: ['Instant', 'Batch'],
    example: NotificationType.Instant,
    description:
      'Type of the notification. Instant for immediate notifications, Batch for grouped ones.',
  })
  @IsEnum(NotificationType)
  @IsNotEmpty()
  notificationType: NotificationType;

  @ApiProperty({
    example: 'test@gmail.com',
    description:
      'Recipient email address. Required when deliveryChannel is "Email".',
  })
  @ValidateIf((o) => o.deliveryChannel === DeliveryChannel.Email)
  @IsDefined()
  @IsString()
  @IsEmail()
  email?: string;

  @ApiProperty({
    example: 'c589e948-fb91-475c-9043-1b4c05bec680',
    description:
      'User ID to which the system notification is directed. Required when deliveryChannel is "System".',
  })
  @ValidateIf((o) => o.deliveryChannel === DeliveryChannel.System)
  @IsDefined()
  @IsString()
  @IsUUID()
  @IsUserExist({
    message: 'User $value not exists. Choose another User.',
  })
  userId?: string;

  @ApiProperty({
    example: 'Notification content info',
    description: 'Content of the notification',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ValidateIf((o) => o.deliveryChannel === DeliveryChannel.System && o.email)
  @IsNotEmpty({
    message:
      'The "email" field should not be present when the deliveryChannel is "system".',
  })
  emailNotAllowedWhenSystem?: string;

  @ValidateIf((o) => o.deliveryChannel === DeliveryChannel.Email && o.userId)
  @IsNotEmpty({
    message:
      'The "userId" field should not be present when the deliveryChannel is "email".',
  })
  userIdNotAllowedWhenEmail?: string;
}
