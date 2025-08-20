import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../core/database/prisma.service';
import { User } from '../../domain/entities/user';
import { IUserRepository } from '../../domain/repositories/auth.repository';
import { AuthProvider } from '../../domain/entities/auth-provider';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUserByExternalProvider(
    email: string,
    authProvider: AuthProvider,
  ): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email,
        hasConfirmedEmail: true,
        authProviders: [AuthProvider[authProvider]],
        account: { create: {} },
      },
      include: {
        account: true,
      },
    });
    return User.mapToObject(newUser);
  }

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        account: true,
      },
    });
    return User.mapToObject(user);
  }

  async findUserWithActiveVerificationCode(
    email: string,
    code: string,
  ): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        hasConfirmedEmail: false,
        emailValidationCodes: {
          some: {
            code,
            expirationTime: {
              gte: new Date(),
            },
          },
        },
      },
    });
    return User.mapToObject(user);
  }

  async createUser(email: string, encryptedPassword: string): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email,
        hasConfirmedEmail: false,
        password: encryptedPassword,
        authProviders: [AuthProvider.LOCAL],
      },
    });
    return User.mapToObject(newUser);
  }

  async validateAccount(id: string): Promise<User> {
    const [user, account] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { hasConfirmedEmail: true },
        include: { account: true },
      }),
      this.prisma.account.create({ data: { userId: id } }),
    ]);

    return User.mapToObject({ ...user, account });
  }

  async registerSession(id: string): Promise<void> {
    this.prisma.user.update({
      where: {
        id,
      },
      data: {
        lastSession: new Date(),
      },
    });
  }
}
