import { EmailVerificationCode } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

export enum NotificationStatus {
  READY_TO_SEND = 'READY_TO_SEND',
  FAILED = 'FAILED',
  SENT = 'SENT',
}

export class VerificationCode {
  readonly id: string;
  readonly notificationStatus: NotificationStatus;
  readonly expirationTime: Date;
  readonly createdAt: Date;

  static mapToObject(data: EmailVerificationCode): VerificationCode {
    return plainToInstance(VerificationCode, {
      id: data.id,
      notificationStatus: data.notificationStatus,
      expirationTime: data.expirationTime,
      createdAt: data.createdAt,
    });
  }

  static mapToObjects(data: EmailVerificationCode[]): VerificationCode[] {
    return data.map((code) => VerificationCode.mapToObject(code));
  }
}
