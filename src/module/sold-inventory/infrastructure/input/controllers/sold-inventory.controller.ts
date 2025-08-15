import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { BrokerService } from 'src/core/event-broker/broker.service';
import { WithImplicitCoercion } from 'buffer';
import { NotifyUsersSoldVehiclesUseCase } from 'src/module/sold-inventory/application/notify-users-sold-vehicles.use-case';
import { SoldVehicleEventDto } from '../dtos/event/incoming-sold-vehicle-event.dto';

const SOLD_INVENTORY_ROUTING_KEY = 'sold_inventory_queue';

@Controller()
export class SoldInventoryController {
  private readonly logger = new Logger(SoldInventoryController.name);
  constructor(
    private readonly eventBroker: BrokerService,
    private readonly notifyUsersSoldVehiclesUseCase: NotifyUsersSoldVehiclesUseCase,
  ) {}

  @EventPattern(SOLD_INVENTORY_ROUTING_KEY)
  async handleSoldVehicle(
    @Payload() buffer: WithImplicitCoercion<string>,
    @Ctx() context,
  ): Promise<void> {
    const payload = JSON.parse(Buffer.from(buffer, 'base64').toString('utf8')) as SoldVehicleEventDto;
    this.logger.verbose({
      message: `[Consumer] Received new message in routingKey=${SOLD_INVENTORY_ROUTING_KEY}`,
      payload,
    });

    this.notifyUsersSoldVehiclesUseCase.execute(payload)
    this.eventBroker.ack(context);
  }
}
