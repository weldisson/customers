import { Module } from '@nestjs/common';
import { CustomerModule } from './interfaces/customer/customer.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CustomerModule,
  ],
})
export class AppModule {}
