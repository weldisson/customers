import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Customer } from '../entities/customer.entity';
import { CustomerRepository } from '../repositories/customer.repository';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

@Injectable()
export class CustomerService {
  private readonly logger = new Logger(CustomerService.name);

  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const id = uuidv4();
    const customer = new Customer(
      id,
      createCustomerDto.name,
      createCustomerDto.document,
    );
    const result = await this.customerRepository.save(customer);
    return result;
  }

  async getById(id: string): Promise<Customer> {
    this.logger.log(`id: (${id})`);
    const customer = await this.customerRepository.findById(id);

    return customer;
  }

  async update(
    id: string,
    updatedCustomerDto: UpdateCustomerDto,
  ): Promise<Customer> {
    this.logger.log(`id: (${id})`);
    this.logger.log(
      `updatedCustomerDto: (${JSON.stringify(updatedCustomerDto)})`,
    );
    const customer = await this.customerRepository.update(
      id,
      updatedCustomerDto,
    );

    return customer;
  }
}
