import { createHash } from 'crypto';

export function generateSHA256Hash(input: string): string {
  return createHash('sha256').update(input).digest('hex');
}

export function computeNotificationHash(
  eventName: string,
  deliveryChannel: string,
  receiverId: string | undefined,
): string {
  return generateSHA256Hash(`${eventName},${deliveryChannel},${receiverId}`);
}
