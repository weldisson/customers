import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';
import { Response } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signIn', () => {
    it('should return authentication token', async () => {
      const authDto: AuthDto = {
        username: 'test@test.co',
        password: '1234',
      };

      const expectedResult = {
        access_token: 'test token',
      };

      jest.spyOn(authService, 'signIn').mockResolvedValue(expectedResult);

      const responseMock = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      };

      const res = responseMock as unknown as Response;

      await controller.signIn(authDto, res);

      expect(responseMock.status).toHaveBeenCalledWith(200);
      expect(responseMock.json).toHaveBeenCalledWith(expectedResult);
    });
  });
});
