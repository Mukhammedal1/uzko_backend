import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSaleDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  customer_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  paid_amount: number;

  @ApiProperty({ type: Number, default: 0 })
  @IsNotEmpty()
  @IsNumber()
  debt_amount: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  note: string;
}
