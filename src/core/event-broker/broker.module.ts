import { DynamicModule, Logger, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { BrokerService } from './broker.service';
import { ConfigService } from '@nestjs/config';

interface RmqModuleOptions {
  readonly name: string;
}

@Module({
  providers: [BrokerService],
  exports: [BrokerService],
})
export class BrokerModule {
  static register({ name }: RmqModuleOptions): DynamicModule {
    return {
      module: BrokerModule,
      exports: [ClientsModule],
      imports: [
        ClientsModule.registerAsync([
          {
            name,
            useFactory: (configService: ConfigService) => {
              const logger = new Logger('BrokerModule');
              const currentQueue = configService.get<string>(
                `RABBIT_MQ_${name}_QUEUE`,
              );
              logger.verbose(
                `[Producer] Connecting to RabbitMQ queue: ${currentQueue} 📦`,
              );
              return {
                transport: Transport.RMQ,
                options: {
                  urls: [configService.get<string>('RABBIT_MQ_HOST')],
                  exchangeType: 'direct',
                  queue: currentQueue,
                },
              };
            },
            inject: [ConfigService],
          },
        ]),
      ],
    };
  }
}
