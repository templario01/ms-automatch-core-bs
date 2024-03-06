import { User as PrismaUser } from '@prisma/client';
import { plainToInstance } from 'class-transformer';

export class User {
  readonly id: string;
  readonly email: string;
  readonly refreshToken?: string;
  readonly lastSession: Date;
  readonly hasConfirmedEmail: boolean;

  static mapToDto(data: PrismaUser): User {
    if (!data) return null;
    return plainToInstance(User, {
      id: data.id,
      email: data.email,
      hasConfirmedEmail: data.hasConfirmedEmail,
      refreshToken: data.refreshToken,
      lastSession: data.lastSession,
    });
  }
}
