import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { Customer } from '../entities/customer.entity';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@Controller('customer')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
@ApiTags('Customer')
export class CustomersController {
  private readonly logger = new Logger(CustomersController.name);

  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    this.logger.log('Creating a new customer');
    const customer = await this.customerService.create(createCustomerDto);
    return customer;
  }

  @Get(':id')
  async getCustomerById(@Param('id') id: string): Promise<Customer> {
    this.logger.log('Getting customer by id');
    const customer = await this.customerService.getById(id);
    return customer;
  }

  @Put(':id')
  async updateCustomer(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    this.logger.log('Updating customer');
    const customer = await this.customerService.update(id, updateCustomerDto);
    return customer;
  }
}
