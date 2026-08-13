import { PERMISSION_TYPE } from '@enums';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePermissionDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  module_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  page_id: number;

  @ApiProperty({
    enum: PERMISSION_TYPE,
    default: PERMISSION_TYPE.BUSINESS,
  })
  @IsEnum(PERMISSION_TYPE)
  @IsOptional()
  permission_type: PERMISSION_TYPE;
}
