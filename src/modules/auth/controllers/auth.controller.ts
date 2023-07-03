import { Response } from 'express';
import { Controller, Post, Body, Res, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { AuthDto } from '../dtos/auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signIn(@Body() authDto: AuthDto, @Res() res: Response): Promise<any> {
    this.logger.log('getting authentication token');
    const result = await this.authService.signIn(authDto);
    return res.status(200).json(result);
  }
}
