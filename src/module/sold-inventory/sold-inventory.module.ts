import { Module } from '@nestjs/common';
import { SoldInventoryController } from './infrastructure/controllers/sold-inventory.controller';
import { BrokerModule } from 'src/core/event-broker/broker.module';

@Module({
  imports: [BrokerModule],
  controllers: [],
  providers: [SoldInventoryController],
})
export class SoldInventoryModule {}
