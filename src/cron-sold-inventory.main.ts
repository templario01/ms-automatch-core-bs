import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrokerService } from './core/event-broker/broker.service';
import { SoldInventoryModule } from './app-sold-inventory.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AUTOMATCH_SOLD_INVENTORY } from './core/event-broker/dtos/services';

async function bootstrap() {
  const app =
    await NestFactory.create<NestFastifyApplication>(SoldInventoryModule);
  const logger = new Logger('Bootstrap');
  const eventBroker = app.get<BrokerService>(BrokerService);
  app.connectMicroservice(eventBroker.getOptions(AUTOMATCH_SOLD_INVENTORY));

  const port = app.get(ConfigService).get<number>('PORT');
  const liveLivenessTimeInMillis =
    app.get(ConfigService).get<number>('LIVE_LIVENESS_TIME_IN_MINUTES') * 60000;

  await app.startAllMicroservices();
  await app.listen(port, () => {
    logger.log(`Server running on port: ${port} 🚀 ✨✨`);
  });

  setTimeout(async () => {
    logger.log('CronJob Sold Inventory - executed');
    await app.close();
  }, liveLivenessTimeInMillis);

}
bootstrap();
