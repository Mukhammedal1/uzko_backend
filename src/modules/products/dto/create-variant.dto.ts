import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductVariantDto } from './create-product.dto';
import { IsInt, IsNumber, IsOptional, IsPositive, Min } from 'class-validator';

export class CreateVariantDto extends CreateProductVariantDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  stock_id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  shelf_number_id?: number;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  alert_quantity?: number;
}
