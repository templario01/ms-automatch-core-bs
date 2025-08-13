import { Injectable } from '@nestjs/common';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { Account } from '../domain/entities/account';
import { IFavoriteVehicleRepository } from '../domain/repositories/favorite-vehicle.repository';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GetAccountInformationUseCase {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly favoriteVehicleRepository: IFavoriteVehicleRepository,
  ) {}

  async execute(accountId: string): Promise<Account> {
    const account = await this.accountRepository.findById(accountId);
    const favoriteVehicles =
      await this.favoriteVehicleRepository.findFavoriteVehiclesByAccountId(
        accountId,
      );

    return plainToInstance(Account, {
      ...account,
      favoriteVehicles,
    } as Account);
  }
}
