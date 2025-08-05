import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { VehiclePayload } from '../dtos/vehicle.payload.dto';
import { BrokerService } from 'src/core/event-broker/broker.service';

@Controller()
export class SoldInventoryController {
  private readonly logger = new Logger(SoldInventoryController.name);
  constructor(private readonly eventBroker: BrokerService) {}

  @EventPattern('sold_inventory_queue')
  async handleSoldVehicle(@Payload() data: VehiclePayload, @Ctx() context) {
    this.logger.log(`Received data: ${JSON.stringify(data)}`);
    this.eventBroker.ack(context);
  }
}
