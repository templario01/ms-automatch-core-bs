import { ApiProperty } from '@nestjs/swagger';
import { NotificationStatus } from '../../../../domain/entities/validation-code';

export class VerificationCodeDto {
  @ApiProperty({
    description: 'Verification code ID',
    example: '65aeef8c8e4565258e33316e',
  })
  readonly id: string;

  @ApiProperty({
    description: 'Status of email verification proccess',
    enum: ['READY_TO_SEND', 'FAILED', 'SENT'],
    example: ' READY_TO_SEND',
  })
  readonly notificationStatus: NotificationStatus;

  @ApiProperty({
    description: 'Code expiration time',
    example: '2024-01-22T22:43:39.640+00:0',
  })
  readonly expirationTime: Date;

  @ApiProperty({
    description: 'Code creation time',
    example: '2024-01-22T22:43:39.640+00:0',
  })
  readonly createdAt: Date;
}
