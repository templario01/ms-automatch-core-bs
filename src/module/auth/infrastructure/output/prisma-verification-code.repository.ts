import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { randAlphaNumeric } from '@ngneat/falso';
import {
  NotificationStatus,
  VerificationCode,
} from '../../domain/entities/validation-code';
import { IVerificationCodeRepository } from '../../domain/repositories/verification-code.repository';

@Injectable()
export class PrismaVerificationCodeRepository
  implements IVerificationCodeRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async generateVerificationCode(): Promise<string> {
    const usedCodes = await this.prisma.emailVerificationCode
      .findMany({
        where: {
          expirationTime: { gt: new Date() },
        },
        select: { code: true },
      })
      .then((codes) => codes.map(({ code }) => code));

    const code = Array.from({ length: 6 }, () =>
      randAlphaNumeric().toString().toUpperCase(),
    ).join('');

    if (usedCodes.includes(code)) {
      return this.generateVerificationCode();
    }

    return code;
  }

  async createVerificationCode(
    email: string,
    code: string,
  ): Promise<VerificationCode> {
    const { currentTime, MINUTES, MILISECONDS } = {
      currentTime: new Date(),
      MINUTES: 5,
      MILISECONDS: 60000,
    };
    const expirationTime = new Date(
      currentTime.getTime() + MINUTES * MILISECONDS,
    );

    const validationCode = await this.prisma.emailVerificationCode.create({
      data: {
        user: { connect: { email } },
        code,
        expirationTime,
        notificationStatus: NotificationStatus.READY_TO_SEND,
      },
    });

    return VerificationCode.mapToObject(validationCode);
  }

  async findActiveCodes(userId: string): Promise<VerificationCode[]> {
    const { currentTime, MINUTES, MILISECONDS } = {
      currentTime: new Date(),
      MINUTES: 2,
      MILISECONDS: 60000,
    };
    const twoMinutesAgoTime = new Date(
      currentTime.getTime() - MINUTES * MILISECONDS,
    );
    const codes = await this.prisma.emailVerificationCode.findMany({
      where: {
        userId,
        createdAt: {
          gte: twoMinutesAgoTime,
        },
      },
    });

    return VerificationCode.mapToObjects(codes);
  }
}
