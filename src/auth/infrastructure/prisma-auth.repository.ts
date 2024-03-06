import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
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
    return User.mapToDto(user);
  }

  async createUser(email: string, encryptedPassword: string): Promise<User> {
    const newUser = await this.prisma.user.create({
      data: {
        email,
        hasConfirmedEmail: false,
        password: encryptedPassword,
      },
    });
    return User.mapToDto(newUser);
  }
}
