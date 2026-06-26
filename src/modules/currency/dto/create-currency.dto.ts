import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  short_name: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  symbol: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  rate: number;

  @ApiProperty({ type: Boolean, required: false })
  @IsOptional()
  @IsBoolean()
  is_main: boolean;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;
}
