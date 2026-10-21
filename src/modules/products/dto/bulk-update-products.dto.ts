import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { BulkUpdateVariantItemDto } from './bulk-update-variants.dto';
import { UpsertVariantItemDto } from './upsert-variant-item.dto';

export class BulkUpdateProductItemDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  unit_id?: number;

  @ApiPropertyOptional({ type: [UpsertVariantItemDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2000)
  @ValidateNested({ each: true })
  @Type(() => UpsertVariantItemDto)
  variants?: UpsertVariantItemDto[];
}

export class BulkUpdateProductsDto {
  @ApiProperty({ type: [BulkUpdateProductItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2000)
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateProductItemDto)
  products: BulkUpdateProductItemDto[];
}
