import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from '../dtos/auth.dto';

interface AuthResponse {
  access_token: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(authDto: AuthDto): Promise<any> {
    const data = this.makeRequestBody(authDto);
    const response = await this.getAuthentication(data);
    this.logger.log(JSON.stringify(response));

    if (response?.access_token) {
      const access_token = await this.jwtService.signAsync(authDto, {
        secret: this.configService.get('SECRET'),
      });
      return { access_token };
    }
    throw new UnauthorizedException('Invalid Credentials');
  }

  private makeRequestBody(authDto: AuthDto): any {
    const data = {
      grant_type: this.configService.get<string>('GRANT_TYPE'),
      username: authDto.username,
      password: authDto.password,
      client_id: this.configService.get<string>('CLIENT_ID'),
      client_secret: this.configService.get<string>('CLIENT_SECRET'),
      scope: this.configService.get<string>('SCOPE'),
    };

    this.logger.log(JSON.stringify(data));

    return data;
  }

  private async getAuthentication(
    data: Record<string, string | ReadonlyArray<string>>,
  ): Promise<AuthResponse> {
    try {
      const response = await this.httpService.axiosRef.post(
        `${this.configService.get(
          'SSO_URL',
        )}/auth/realms/careers/protocol/openid-connect/token`,
        data,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException(err);
    }
  }
}
