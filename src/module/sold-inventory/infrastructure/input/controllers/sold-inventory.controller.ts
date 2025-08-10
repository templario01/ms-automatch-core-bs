import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';

import { BrokerService } from 'src/core/event-broker/broker.service';
import { SoldVehicleEventDto } from '../dtos/event/incoming-sold-vehicle-event.dto';
import { WithImplicitCoercion } from 'buffer';

@Controller()
export class SoldInventoryController {
  private readonly logger = new Logger(SoldInventoryController.name);
  constructor(private readonly eventBroker: BrokerService) {}

  @EventPattern('sold_inventory_queue')
  async handleSoldVehicle(
    @Payload() buffer: WithImplicitCoercion<string>,
    @Ctx() context,
  ): Promise<void> {
    const payload = JSON.parse(Buffer.from(buffer, 'base64').toString('utf8'));
    this.logger.log(`Received data: ${JSON.stringify(payload)}`);
    this.eventBroker.ack(context);
  }
}
