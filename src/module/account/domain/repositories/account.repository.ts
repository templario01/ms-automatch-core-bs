import { Injectable } from '@nestjs/common';
import { Account } from 'src/module/account/domain/entities/account';

@Injectable()
export abstract class IAccountRepository {
  abstract findById(id: string): Promise<Account>;
  abstract update(
    id: string,
    hasActiveNotifications: boolean,
  ): Promise<Account>;
}
