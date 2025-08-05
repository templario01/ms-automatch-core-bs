import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BrokerService } from './core/event-broker/broker.service';
import { AppSoldInventoryModule } from './app-sold-inventory.module';
import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { AUTOMATCH_SOLD_INVENTORY } from './core/event-broker/dtos/services';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppSoldInventoryModule,
  );
  const logger = new Logger('Bootstrap');

  const eventBroker = app.get<BrokerService>(BrokerService);
  const connection = eventBroker.getOptions(AUTOMATCH_SOLD_INVENTORY);
  app.connectMicroservice(connection);
  logger.log(`[Consumer] Connecting to RabbitMQ queue: : ${connection.options.queue} 📦`);

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
