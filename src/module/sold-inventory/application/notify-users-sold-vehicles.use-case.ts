import { Inject, Injectable, Logger } from '@nestjs/common';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, tap } from 'rxjs';
import { obfuscateEmail } from 'src/core/utils/obfuscate.utils';
import { SoldVehicleEventDto } from '../infrastructure/input/dtos/event/incoming-sold-vehicle-event.dto';
import { NotifyUserSoldVehicleEventDto } from '../infrastructure/input/dtos/event/outcoming-sold-vehicle-event.dto';
import { AUTOMATCH_EMAIL_NOTIFICATION } from 'src/core/event-broker/dtos/services';
import { NOTIFY_USER_EMAIL_ROUTING_KEY } from 'src/core/event-broker/constants/routing-key';
import { IFavoriteVehicleRepository } from '../domain/entities/favorite-vehicle.repository';
import { format } from 'date-fns';

import { es } from 'date-fns/locale';

const fechaStr = '14 de agosto del 2024';
const timezone = 'America/Lima';

@Injectable()
export class NotifyUsersSoldVehiclesUseCase {
  private readonly logger = new Logger(NotifyUsersSoldVehiclesUseCase.name);

  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly favoriteVehicleRepository: IFavoriteVehicleRepository,
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
          vehicles: account.favoriteVehicles
            .map((favoriteVehicle) => {
              const vehicle = vehiclesMap.get(favoriteVehicle.vehicleId);
              if (!vehicle) return null;
              return {
                favoriteVehicleId: favoriteVehicle.id,
                vehicle: {
                  id: vehicle.id,
                  externalId: vehicle.externalId,
                  url: vehicle.url,
                  name: vehicle.name.toUpperCase(),
                  description: vehicle.description,
                  year: vehicle.year,
                  mileage: vehicle.mileage ? `${vehicle.mileage} km` : undefined,
                  frontImage: vehicle.frontImage,
                  location: vehicle.location,
                  condition: vehicle.condition == 'NEW' ? 'nuevo' : 'Seminuevo',
                  originalPrice: vehicle.originalPrice,
                  price: vehicle.price,
                  currency: vehicle.currency,
                  createdAt: format(
                    vehicle.createdAt,
                    "dd 'de' MMMM 'del' yyyy",
                    { locale: es },
                  ),
                  updatedAt: format(
                    vehicle.updatedAt,
                    "dd 'de' MMMM 'del' yyyy",
                    { locale: es },
                  ),
                  status: vehicle.status,
                  website: vehicle.website.name,
                },
              };
            })
            .filter(Boolean),
        };
        const payload = Buffer.from(
          JSON.stringify({
            email: notifyUserSoldVehicleEvent.email,
            subject: 'Algunos de tus vehículos favoritos fueron vendidos',
            body: notifyUserSoldVehicleEvent,
            templateId: 'soldVehiclesEmail',
          }),
        ).toString('base64');
        await lastValueFrom(
          this.notificationClient
            .emit(NOTIFY_USER_EMAIL_ROUTING_KEY, payload)
            .pipe(
              /*             tap(() => {
                const favoriteVehicleIds =
                  notifyUserSoldVehicleEvent.vehicles.map(
                    (vehicle) => vehicle.favoriteVehicleId,
                  );
                this.favoriteVehicleRepository.updateManyByIds(
                  favoriteVehicleIds,
                );
              }), */
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
