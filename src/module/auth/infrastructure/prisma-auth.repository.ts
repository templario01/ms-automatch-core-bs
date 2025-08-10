import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/database/prisma.service';
import { User } from '../domain/entities/user';
import { IAuthRepository } from '../domain/repositories/auth.repository';

@Injectable()
export class PrismaAuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
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
      },
    });
    return User.mapToObject(newUser);
  }

  async validateAccount(id: string): Promise<User> {
    const [user] = await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id },
        data: { hasConfirmedEmail: true },
      }),
      this.prisma.account.create({ data: { userId: id } }),
    ]);

    return User.mapToObject(user);
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
