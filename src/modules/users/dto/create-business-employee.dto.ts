import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBusinessEmployeeDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;

  @ApiProperty({ type: Array })
  @IsArray()
  @ArrayNotEmpty()
  @Type(() => Number)
  @IsInt({ each: true })
  page_ids: number[];
}
