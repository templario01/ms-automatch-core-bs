import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { BrokerService } from '../../../../core/event-broker/broker.service';

@Controller()
export class SoldInventoryController {
  private readonly logger = new Logger(SoldInventoryController.name);
  constructor(
    private readonly eventBroker: BrokerService,
  ) {}

  @EventPattern('sold_inventory_queue')
  async handleEmailNotification(@Payload() data: any, @Ctx() context) {
    this.logger.log(`Received notification data: ${JSON.stringify(data)}`);
    this.eventBroker.ack(context);
  }
  
}
