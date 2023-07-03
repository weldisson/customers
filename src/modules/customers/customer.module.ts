import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { CustomerService } from './services/customer.service';
import { CustomersController } from './controllers/customers.controller';
import { CustomerRepository } from './repositories/customer.repository';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/services/auth.service';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [CustomersController],
  providers: [CustomerService, CustomerRepository, AuthService, JwtService],
})
export class CustomerModule {}
