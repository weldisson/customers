import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { CustomerRepository } from '../repositories/customer.repository';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';
import { Customer } from '../entities/customer.entity';

describe('CustomerService', () => {
  let service: CustomerService;
  let customerRepository: CustomerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: {
            save: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  describe('create', () => {
    it('should create a new customer', async () => {
      const createCustomerDto: CreateCustomerDto = {
        name: 'John Doe',
        document: '123456789',
      };

      const savedCustomer: Customer = {
        id: expect.any(String),
        name: 'John Doe',
        document: '123456789',
      };

      jest.spyOn(CustomerRepository, 'save').mockResolvedValue(savedCustomer);

      const result = await service.create(createCustomerDto);

      expect(CustomerRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: createCustomerDto.name,
          document: createCustomerDto.document,
        }),
      );

      expect(result).toEqual(savedCustomer);
    });
  });

  describe('getById', () => {
    it('should get a customer by id', async () => {
      const customerId = '123';

      const foundCustomer: Customer = {
        id: customerId,
        name: 'John Doe',
        document: '123456789',
      };

      jest
        .spyOn(customerRepository, 'findById')
        .mockResolvedValue(foundCustomer);

      const result = await service.getById(customerId);

      expect(customerRepository.findById).toHaveBeenCalledWith(customerId);
      expect(result).toEqual(foundCustomer);
    });
  });

  describe('update', () => {
    it('should update a customer', async () => {
      const customerId = '123';
      const updatedCustomerDto: UpdateCustomerDto = {
        id: customerId,
        name: 'Updated Name',
        document: '987654321',
      };

      const updatedCustomer: Customer = {
        id: customerId,
        name: 'Updated Name',
        document: '987654321',
      };

      jest
        .spyOn(customerRepository, 'update')
        .mockResolvedValue(updatedCustomer);

      const result = await service.update(customerId, updatedCustomerDto);

      expect(customerRepository.update).toHaveBeenCalledWith(
        customerId,
        expect.objectContaining({
          name: updatedCustomerDto.name,
          document: updatedCustomerDto.document,
        }),
      );

      expect(result).toEqual(updatedCustomer);
    });
  });
});
