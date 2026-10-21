import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { UpdateProductVariantDto } from './update-product-variant.dto';

// id bor — shu variant yangilanadi (hammasi ixtiyoriy, meros UpdateProductVariantDto'dan)
// id yo'q — YANGI variant yaratiladi, shuning uchun quyidagi 4ta maydon majburiy bo'ladi
export class UpsertVariantItemDto extends UpdateProductVariantDto {
  @ApiPropertyOptional({ type: Number })
  @ValidateIf((o) => o.id !== undefined)
  @IsInt()
  @IsPositive()
  id?: number;

  @ValidateIf((o) => !o.id)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ValidateIf((o) => !o.id)
  @IsInt()
  @IsPositive()
  purchase_price_currency_id: number;

  @ValidateIf((o) => !o.id)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  retail_price: number;

  @ValidateIf((o) => !o.id)
  @IsInt()
  @IsPositive()
  retail_price_currency_id: number;
}
