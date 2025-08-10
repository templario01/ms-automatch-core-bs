import { User as PrismaUser } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { override } from 'joi';
import { UserWithAccount } from 'src/core/database/types/account.type';
import { Account } from 'src/module/account/domain/entities/account';

export enum AuthFlow {
  LOGIN = 'LOGIN',
  REGISTER = 'REGISTER',
}

export class User {
  readonly id: string;
  readonly email: string;
  readonly encryptedPassword?: string;
  readonly refreshToken?: string;
  readonly lastSession: Date;
  readonly hasConfirmedEmail: boolean;
  readonly account?: Account;

  static mapToObject(data: PrismaUser): User;
  static mapToObject(data: UserWithAccount): User;

  static mapToObject(data: UserWithAccount | PrismaUser): User {
    if (!data) return null;
    return plainToInstance(User, {
      id: data.id,
      email: data.email,
      hasConfirmedEmail: data.hasConfirmedEmail,
      refreshToken: data.refreshToken,
      lastSession: data.lastSession,
      encryptedPassword: data.password,
      ...('account' in data && { account: data.account }),
    });
  }
}
