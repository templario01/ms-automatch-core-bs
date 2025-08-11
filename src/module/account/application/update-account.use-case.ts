import { Injectable } from '@nestjs/common';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { Account } from '../domain/entities/account';

@Injectable()
export class UpdateAccountUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(
    accountId: string,
    hasActiveNotifications: boolean,
  ): Promise<Account> {
    return this.accountRepository.update(accountId, hasActiveNotifications);
  }
}
