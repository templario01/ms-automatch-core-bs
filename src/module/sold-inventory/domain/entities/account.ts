import { AccountWithRelations } from 'src/core/database/types/account.type';
import { FavoriteVehicle } from './favorite-vehicle';
import { plainToInstance } from 'class-transformer';
import { User } from 'src/module/auth/domain/entities/user';

export class Account {
  readonly id: string;
  readonly hasActiveNotifications: boolean;
  readonly createdAt: Date;
  readonly user: User;
  readonly favoriteVehicles: FavoriteVehicle[];

  static mapToObject(data: AccountWithRelations): Account {
    if (!data) return null;
    return plainToInstance(Account, {
      id: data.id,
      hasActiveNotifications: data.hasActiveNotifications,
      createdAt: data.createdAt,
      user: User.mapToObject(data.user),
      favoriteVehicles: data.favoriteVehicles.map(FavoriteVehicle.mapToObject),
    } as Account);
  }
}
