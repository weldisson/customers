import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
