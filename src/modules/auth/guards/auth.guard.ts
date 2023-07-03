import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadGatewayException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      throw new BadGatewayException('No token provided');
    }
    const token = request.headers.authorization.split(' ')[1];

    try {
      const decoded = await this.jwtService.verify(token, {
        secret: this.configService.get('SECRET'),
      });
      request.user = decoded;
      return true;
    } catch (error) {
      return false;
    }
  }
}
