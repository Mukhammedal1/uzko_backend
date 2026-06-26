import { NameDto } from '@database';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class CreatePageDto {
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
  module_id: number;
}
