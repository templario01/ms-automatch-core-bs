import { Inject, Injectable, Logger } from '@nestjs/common';
import { VehiclePayload } from '../infrastructure/input/dtos/vehicle.payload.dto';
import { IAccountRepository } from '../domain/repositories/account.repository';
import { ClientProxy } from '@nestjs/microservices';
import { AUTOMATCH_EMAIL_NOTIFICATION } from 'src/core/event-broker/dtos/services';
import { lastValueFrom, tap } from 'rxjs';
import { obfuscateEmail } from 'src/core/utils/obfuscate.utils';

@Injectable()
export class NotifyUsersSoldVehiclesUseCase {
  private readonly logger = new Logger(NotifyUsersSoldVehiclesUseCase.name);

  constructor(
    private readonly accountRepository: IAccountRepository,
    @Inject(AUTOMATCH_EMAIL_NOTIFICATION)
    private notificationClient: ClientProxy,
  ) {}

  async execute({ soldVehicles }: VehiclePayload): Promise<void> {
    const vehicleIds = soldVehicles.map((vehicle) => vehicle.id);
    const accounts =
      await this.accountRepository.getAccountWithFavoriteVehiclesByVehicleId(
        vehicleIds,
      );

    await Promise.all(
      accounts.map(async (account) => {
        const payload = Buffer.from(JSON.stringify({})).toString('base64');
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
