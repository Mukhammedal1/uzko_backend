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
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  allow_below_cost_sale?: boolean;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  purchase_price: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  purchase_price_currency_id: number;

  @ApiProperty({ type: Number })
  @IsNumber()
  @Min(0)
  retail_price: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  retail_price_currency_id: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  retail_price_percentage?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  wholesale_price?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  wholesale_price_currency_id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber()
  @Min(0)
  wholesale_price_percentage?: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  unit_id: number;

  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  stock_id: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsInt()
  @IsPositive()
  shelf_number_id?: number;

  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((v) => String(v).trim()).filter(Boolean)
      : value,
  )
  barcodes: string[];
}

export class CreateProductsDto {
  @ApiProperty({ type: [CreateProductDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(1000)
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products: CreateProductDto[];

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  @IsBoolean()
  is_purchase?: boolean;
}
