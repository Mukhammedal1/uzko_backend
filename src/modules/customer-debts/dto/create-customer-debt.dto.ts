import { CUSTOMER_DEBTS_STATUS } from '@enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCustomerDebtDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  sale_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  note: string;

  @ApiPropertyOptional({
    enum: CUSTOMER_DEBTS_STATUS,
    default: CUSTOMER_DEBTS_STATUS.UNPAID,
  })
  @IsOptional()
  @IsEnum(CUSTOMER_DEBTS_STATUS)
  status: CUSTOMER_DEBTS_STATUS;
}
