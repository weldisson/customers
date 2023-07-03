import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  BadGatewayException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from '../../../infrastructure/repository';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerRepository extends Repository {
  private readonly logger = new Logger(CustomerRepository.name);
  async findById(id: string): Promise<Customer> {
    try {
      const customer = await this.redisClient.get(id);
      return JSON.parse(customer);
    } catch (error) {
      this.logger.error('error trying to find customer');
      throw new BadGatewayException(error);
    }
  }

  async save(customer: Customer): Promise<Customer> {
    try {
      this.logger.log('trying to save customer');
      const result = await this.redisClient.set(
        customer.id,
        JSON.stringify(customer),
      );

      if (result === 'OK') {
        this.logger.log('customer saved');
        const savedCustomer = await this.findById(customer.id);
        return savedCustomer;
      }
      throw new BadRequestException('error trying to save customer');
    } catch (error) {
      this.logger.error('error trying to save customer');
      throw new BadGatewayException(error);
    }
  }

  async update(id: string, updatedCustomer: Customer): Promise<Customer> {
    try {
      const customer = await this.findById(id);
      if (customer) {
        const body = {
          ...customer,
          ...updatedCustomer,
        };
        if (customer.id !== updatedCustomer.id) {
          const newCustomerAlreadyExists = await this.findById(
            updatedCustomer.id,
          );
          if (newCustomerAlreadyExists) {
            throw new ConflictException('this customer already exists');
          }
          this.logger.log('trying to delete previous customer from cache');
          await this.redisClient.del(id);
        }

        this.logger.log(
          `trying to update customer with body ${JSON.stringify(body)}`,
        );
        const result = await this.redisClient.set(
          body.id,
          JSON.stringify(body),
        );
        if (result === 'OK') {
          return this.findById(body.id);
        } else {
          this.logger.error('error trying to update customer');
          throw new BadGatewayException('error trying to update customer');
        }
      } else {
        this.logger.error('customer not found');

        throw new NotFoundException('Customer not found');
      }
    } catch (error) {
      this.logger.error('error trying to update customer');
      throw new BadGatewayException(error);
    }
  }
}
