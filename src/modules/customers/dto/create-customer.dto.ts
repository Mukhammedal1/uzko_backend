import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  phone_nuumber: string;

  @ApiProperty({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  debt_amount: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;
}
