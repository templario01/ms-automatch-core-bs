import { Injectable } from '@nestjs/common';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { Account } from '../domain/entities/account';

@Injectable()
export class GetAccountInformationUseCase {
  constructor(private readonly accountRepository: IAccountRepository) {}

  async execute(accountId: string): Promise<Account> {
    return this.accountRepository.findById(accountId);
  }
}
