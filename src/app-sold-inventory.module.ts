import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EnvSettings, envSettings } from './core/settings/env.settings';
import { BrokerModule } from './core/event-broker/broker.module';
import { AUTOMATCH_SOLD_INVENTORY } from './core/event-broker/dtos/services';

@Module({
  imports: [
    SoldInventoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object<EnvSettings>(envSettings),
      envFilePath: '.env',
    }),
  ],
  controllers: [],
  providers: [],
})
export class SoldInventoryModule {}
