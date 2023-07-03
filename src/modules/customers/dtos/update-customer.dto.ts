import { CreateCustomerDto } from './create-customer.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto extends CreateCustomerDto {
  @IsNotEmpty()
  @IsUUID()
  @ApiProperty({
    description: 'UUIDv4',
    example: 'ad587370-337b-4057-ac41-a061cd75b189',
  })
  id: string;
}
