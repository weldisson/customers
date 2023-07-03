import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'client email',
    example: 'john.doe@email.com',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Base 64 encoded email',
    example: 'am9obi5kb2VAZW1haWwuY29t',
  })
  password: string;
}
