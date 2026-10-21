import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class BulkDeleteDto {
  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2000)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  product_ids?: number[];

  @ApiPropertyOptional({ type: [Number] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2000)
  @IsInt({ each: true })
  @IsPositive({ each: true })
  variant_ids?: number[];
}
