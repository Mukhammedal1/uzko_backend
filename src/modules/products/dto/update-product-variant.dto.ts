import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { CreateProductVariantDto } from './create-product.dto';

export class UpdateProductVariantDto extends PartialType(
  OmitType(CreateProductVariantDto, ['barcodes', 'file_id'] as const),
) {
  @ApiPropertyOptional({ type: [String] })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? [...new Set(value.map((v) => String(v).trim()).filter(Boolean))]
      : value,
  )
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  barcodes?: string[];

  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsInt()
  @IsPositive()
  file_id?: number | null;

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

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  supplier_id?: number;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  alert_quantity?: number;
}
