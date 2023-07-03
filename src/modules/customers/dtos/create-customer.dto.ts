import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Client document',
    example: '123.456.789-10',
  })
  document: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Client name',
    example: 'John Doe',
  })
  name: string;
}
