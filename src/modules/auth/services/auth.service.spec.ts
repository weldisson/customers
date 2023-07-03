import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from '../dtos/auth.dto';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let httpService: HttpService;
  let configService: ConfigService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: HttpService,
          useValue: {
            axiosRef: {
              post: jest.fn(),
            },
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
          useValue: {
            signAsync: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signIn', () => {
    it('should return access token on successful sign-in', async () => {
      const authDto: AuthDto = {
        username: 'test@test.co',
        password: '1234',
      };

      const mockAccessToken = 'test token';

      jest.spyOn(configService, 'get').mockReturnValue('test');
      jest.spyOn(httpService.axiosRef, 'post').mockResolvedValue({
        data: { access_token: mockAccessToken },
      });
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(mockAccessToken);

      const result = await service.signIn(authDto);

      expect(result).toEqual({ access_token: mockAccessToken });
      expect(configService.get).toHaveBeenCalledTimes(6);
      expect(httpService.axiosRef.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.any(Object),
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith(authDto, {
        secret: 'test',
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const authDto: AuthDto = {
        username: 'test@test.co',
        password: '1234',
      };

      jest.spyOn(configService, 'get').mockReturnValue('test');
      jest.spyOn(httpService.axiosRef, 'post').mockResolvedValue({});

      await expect(service.signIn(authDto)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(configService.get).toHaveBeenCalledTimes(5);
      expect(httpService.axiosRef.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.any(Object),
      );
    });

    it('should throw BadRequestException for network errors', async () => {
      const authDto: AuthDto = {
        username: 'test@test.co',
        password: '1234',
      };

      jest.spyOn(configService, 'get').mockReturnValue('test');
      jest.spyOn(httpService.axiosRef, 'post').mockRejectedValue(new Error());

      await expect(service.signIn(authDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(configService.get).toHaveBeenCalledTimes(5);
      expect(httpService.axiosRef.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Object),
        expect.any(Object),
      );
    });
  });
});
