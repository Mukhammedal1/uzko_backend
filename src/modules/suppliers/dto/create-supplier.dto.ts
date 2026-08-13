import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSupplierDto {
  @ApiProperty({ type: String })
  @IsOptional()
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  phone_number: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;
}
