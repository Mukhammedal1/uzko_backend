import { SALE_METHOD } from '@enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
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

export class PurchaseItemsDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  product_variant_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  stock_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  shelf_number_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  quantity: number;

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
}

export class CreatePurchaseDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  supplier_id: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  paid_amount?: number;

  @ApiProperty({ enum: SALE_METHOD })
  @IsEnum(SALE_METHOD)
  @IsNotEmpty()
  purchase_type: SALE_METHOD;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ type: [PurchaseItemsDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(300)
  @ValidateNested({ each: true })
  @Type(() => PurchaseItemsDto)
  purchase_items: PurchaseItemsDto[];
}
