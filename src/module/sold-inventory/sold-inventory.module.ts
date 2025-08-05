import { Module } from '@nestjs/common';
import { BrokerModule } from 'src/core/event-broker/broker.module';
import { SoldInventoryController } from './infrastructure/input/controllers/sold-inventory.controller';

@Module({
  imports: [BrokerModule],
  controllers: [SoldInventoryController],
  providers: [],
})
export class SoldInventoryModule {}
