import { Inject, Injectable, Logger } from '@nestjs/common';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { ClientProxy } from '@nestjs/microservices';
import { AUTOMATCH_EMAIL_NOTIFICATION } from 'src/core/event-broker/dtos/services';
import { lastValueFrom, tap } from 'rxjs';
import { obfuscateEmail } from 'src/core/utils/obfuscate.utils';
import { SoldVehicleEventDto } from '../infrastructure/input/dtos/event/incoming-sold-vehicle-event.dto copy';
import { NotifyUserSoldVehicleEventDto } from '../infrastructure/input/dtos/event/outcoming-sold-vehicle-event.dto';

@Injectable()
export class NotifyUsersSoldVehiclesUseCase {
  private readonly logger = new Logger(NotifyUsersSoldVehiclesUseCase.name);

  constructor(
    private readonly accountRepository: IAccountRepository,
    @Inject(AUTOMATCH_EMAIL_NOTIFICATION)
    private notificationClient: ClientProxy,
  ) {}

  async execute({ soldVehicles }: SoldVehicleEventDto): Promise<void> {
    const vehicleIds = soldVehicles.map((vehicle) => vehicle.id);
    const vehiclesMap = new Map(
      soldVehicles.map((vehicle) => [vehicle.id, vehicle]),
    );
    const accounts =
      await this.accountRepository.getAccountWithFavoriteVehiclesByVehicleId(
        vehicleIds,
      );

    await Promise.all(
      accounts.map(async (account) => {
        const notifyUserSoldVehicleEvent: NotifyUserSoldVehicleEventDto = {
          email: account.user.email,
          accountId: account.id,
          soldVehicles: account.favoriteVehicles
            .map((favoriteVehicle) => {
              const vehicle = vehiclesMap.get(favoriteVehicle.vehicleId);
              if (!vehicle) return null;
              return {
                favoriteVehicleId: favoriteVehicle.id,
                vehicle: {
                  id: vehicle.id,
                  externalId: vehicle.externalId,
                  url: vehicle.url,
                  name: vehicle.name,
                  description: vehicle.description,
                  year: vehicle.year,
                  mileage: vehicle.mileage,
                  frontImage: vehicle.frontImage,
                  location: vehicle.location,
                  condition: vehicle.condition,
                  originalPrice: vehicle.originalPrice,
                  price: vehicle.price,
                  currency: vehicle.currency,
                  createdAt: vehicle.createdAt,
                  updatedAt: vehicle.updatedAt,
                  status: vehicle.status,
                  website: vehicle.website.name,
                },
              };
            })
            .filter(Boolean),
        };

        const payload = Buffer.from(JSON.stringify(notifyUserSoldVehicleEvent)).toString('base64');
        await lastValueFrom(
          this.notificationClient.emit('notify_user_email', payload).pipe(
            tap(() => {
              this.logger.verbose(
                `[Producer] Sending notification of sold vehicles to: ${obfuscateEmail(account.user.email)}`,
              );
            }),
          ),
        );
      }),
    );
  }
}
