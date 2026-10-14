import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginateProductDto } from '@database';

export class ProductFilterDto extends PaginateProductDto {
  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  stock_id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  supplier_id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  unit_id?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  shelf_number_id?: number;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === ''
      ? undefined
      : value === true || value === 'true',
  )
  @IsBoolean()
  available_image?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === ''
      ? undefined
      : value === true || value === 'true',
  )
  @IsBoolean()
  in_stock?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === ''
      ? undefined
      : value === true || value === 'true',
  )
  @IsBoolean()
  available_limit?: boolean;

  @ApiPropertyOptional({ type: Boolean })
  @IsOptional()
  @Transform(({ value }) =>
    value === undefined || value === ''
      ? undefined
      : value === true || value === 'true',
  )
  @IsBoolean()
  available_barcode?: boolean;
}
