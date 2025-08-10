import { Injectable } from '@nestjs/common';
import { Account } from 'src/module/account/domain/entities/account';


@Injectable()
export abstract class IAccountRepository {
  abstract getAccountWithFavoriteVehiclesByVehicleId(
    vehicleIds: string[],
  ): Promise<Account[]>;
}
