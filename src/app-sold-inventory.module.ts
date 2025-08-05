import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { EnvSettings, envSettings } from './core/settings/env.settings';
import { SoldInventoryModule } from './module/sold-inventory/sold-inventory.module';

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
export class AppSoldInventoryModule {}
