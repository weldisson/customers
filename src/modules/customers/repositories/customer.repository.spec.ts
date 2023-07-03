import { Test } from '@nestjs/testing';
import { CustomerRepository } from './customer.repository';
import { Customer } from '../entities/customer.entity';
import { ConfigService } from '@nestjs/config';

describe('CustomerRepository', () => {
  let repository: CustomerRepository;
  let mockRedisClient: any;

  beforeEach(async () => {
    mockRedisClient = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        CustomerRepository,
        {
          provide: 'RedisClient',
          useValue: mockRedisClient,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    repository = moduleRef.get<CustomerRepository>(CustomerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a customer when found in Redis', async () => {
      const customerId = '1';
      const customer: Customer = {
        id: '1',
        name: 'John Doe',
        document: '1234',
      };
      jest
        .spyOn(mockRedisClient, 'get')
        .mockResolvedValue(JSON.stringify(customer));

      const result = await repository.findById(customerId);

      expect(result).toEqual(customer);
    });
  });

  describe.skip('save', () => {
    it('should save a customer in Redis', async () => {
      const customer: Customer = {
        id: '1',
        name: 'John Doe',
        document: '1234',
      };
      const result = 'OK';
      jest.spyOn(mockRedisClient, 'set').mockResolvedValue(result);
      });
      jest
        .spyOn(mockRedisClient, 'get')
        .mockResolvedValue(JSON.stringify(customer));

      const savedCustomer = await repository.save(customer);

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        customer.id,
        JSON.stringify(customer),
      );
      expect(mockRedisClient.get).toHaveBeenCalledWith(customer.id);
      expect(savedCustomer).toEqual(customer);
    });
  });

  describe.skip('update', () => {
    it('should update a customer in Redis', async () => {
      const customerId = '1';
      const updatedCustomer: Customer = {
        id: '1',
        document: '1234',
        name: 'John Doe',
      };
      const existingCustomer: Customer = {
        id: '1',
        document: '12345',
        name: 'John Doe',
      };
      const result = 'OK';

      mockRedisClient.get.mockResolvedValue(JSON.stringify(existingCustomer));
      mockRedisClient.set.mockResolvedValue(result);

      const updatedCustomerResult = await repository.update(
        customerId,
        updatedCustomer,
      );

      expect(mockRedisClient.get).toHaveBeenCalledWith(customerId);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        updatedCustomer.id,
        JSON.stringify(updatedCustomer),
      );
      expect(mockRedisClient.del).not.toHaveBeenCalled();
      expect(updatedCustomerResult).toEqual(updatedCustomer);
    });
  });
});
