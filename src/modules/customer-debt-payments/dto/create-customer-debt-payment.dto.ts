import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCustomerDebtPaymentDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;
}
