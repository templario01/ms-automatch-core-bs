import { Injectable } from '@nestjs/common';
import { IAccountRepository } from '../../domain/repositories/account.repository';
import { Account } from '../../domain/entities/account';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Account> {
    const account = await this.prisma.account.findUnique({ where: { id } });
    return Account.mapToObject(account);
  }

  async update(id: string, hasActiveNotifications: boolean): Promise<Account> {
    const account = await this.prisma.account.update({
      data: {
        hasActiveNotifications,
      },
      where: {
        id,
      },
    });

    return Account.mapToObject(account);
  }
}
