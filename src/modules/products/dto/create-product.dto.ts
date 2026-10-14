import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

const trimString = ({ value }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateProductVariantDto {
  @ApiProperty({ type: String })
  @Transform(trimString)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ type: String })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  artikul: string;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  quantity?: number;

  @ApiPropertyOptional({ type: Number, default: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  alert_quantity?: number;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  allow_below_cost_sale?: boolean;

  @ApiProperty({ type: Number })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  purchase_price: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  purchase_price_currency_id: number;

  @ApiProperty({ type: Number })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  retail_price: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  retail_price_currency_id: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999.99) // decimal(7,2)
  retail_price_percentage?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  wholesale_price?: number;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  box_quantity?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  wholesale_price_currency_id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(99999.99)
  wholesale_price_percentage?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  file_id?: number;

  @ApiPropertyOptional({ type: [String] })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? [...new Set(value.map((v) => String(v).trim()).filter(Boolean))]
      : value,
  )
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @IsString({ each: true })
  barcodes: string[];
}

export class CreateProductDto {
  @ApiPropertyOptional({ type: String })
  @Transform(trimString)
  @IsOptional()
  @IsString()
  name: string;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  unit_id: number;

  @ApiProperty({ type: [CreateProductVariantDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants: CreateProductVariantDto[];
}

export class CreateProductsDto {
  @ApiProperty({ type: [CreateProductDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(300)
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products: CreateProductDto[];
}
