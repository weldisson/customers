import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { Customer } from '../entities/customer.entity';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('CustomersController', () => {
  let controller: CustomersController;
  let customerService: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn(),
            getById: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    customerService = module.get<CustomerService>(CustomerService);
  });

  describe('createCustomer', () => {
    it('should create a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        document: '123456789',
      };

      const createdCustomer: Customer = {
        id: '1',
        name: 'John Doe',
        document: '123456789',
      };

      (customerService.create as jest.Mock).mockResolvedValue(createdCustomer);

      const result = await controller.createCustomer(createCustomerDto);

      expect(customerService.create).toHaveBeenCalledWith(createCustomerDto);
      expect(result).toEqual(createdCustomer);
    });
  });

  describe('getCustomerById', () => {
    it('should get customer by id', async () => {
      const customerId = '123';

      const expectedCustomer: Customer = {
        document: '123',
        name: 'John Doe',
        id: 'ad587370-337b-4057-ac41-a061cd75b189',
      };

      jest
        .spyOn(customerService, 'getById')
        .mockResolvedValue(expectedCustomer);

      const result = await controller.getCustomerById(customerId);

      expect(result).toEqual(expectedCustomer);
      expect(customerService.getById).toHaveBeenCalledWith(customerId);
    });
  });

  describe('updateCustomer', () => {
    it('should update customer', async () => {
      const customerId = '123';

      const updateCustomerDto: UpdateCustomerDto = {
        document: '12345',
        name: 'John Doe Test',
        id: 'ad587370-337b-4057-ac41-a061cd75b189',
      };

      const expectedCustomer: Customer = {
        document: '12345',
        name: 'John Doe Test',
        id: 'ad587370-337b-4057-ac41-a061cd75b189',
      };

      jest.spyOn(customerService, 'update').mockResolvedValue(expectedCustomer);

      const result = await controller.updateCustomer(
        customerId,
        updateCustomerDto,
      );

      expect(result).toEqual(expectedCustomer);
      expect(customerService.update).toHaveBeenCalledWith(
        customerId,
        updateCustomerDto,
      );
    });
  });
});
