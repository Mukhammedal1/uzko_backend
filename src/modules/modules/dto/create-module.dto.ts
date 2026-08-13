import { NameDto } from '@database';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ type: NameDto, required: true })
  @IsNotEmpty()
  @IsObject()
  name: NameDto;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  key: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  icon_file_id: number;

  @ApiPropertyOptional({ type: Number, required: false })
  @IsOptional()
  @IsNumber()
  order: number;
}
