import {
  DeliveryChannel,
  NotificationType,
} from '../../notification/constants';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';

export class TraceMetaDataDto {
  @IsString()
  @IsOptional()
  eventEmitted?: string;

  @IsOptional()
  @IsEnum(DeliveryChannel)
  deliveryChannel?: DeliveryChannel;

  @IsEnum(NotificationType)
  @IsOptional()
  notificationType?: NotificationType;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  userId?: string;
}