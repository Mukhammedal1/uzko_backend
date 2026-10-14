import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateBusinessCurrencyDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  currency_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  rate: number;
}
