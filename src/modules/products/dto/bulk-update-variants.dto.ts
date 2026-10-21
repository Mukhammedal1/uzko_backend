import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { UpdateProductVariantDto } from './update-product-variant.dto';

export class BulkUpdateVariantItemDto extends UpdateProductVariantDto {
  @ApiProperty({ type: Number })
  @IsInt()
  @IsPositive()
  id: number;
}

export class BulkUpdateVariantsDto {
  @ApiProperty({ type: [BulkUpdateVariantItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(2000)
  @ValidateNested({ each: true })
  @Type(() => BulkUpdateVariantItemDto)
  items: BulkUpdateVariantItemDto[];
}
