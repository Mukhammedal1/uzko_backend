import { NameDto } from '@database';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsObject, IsString } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ type: NameDto, required: true })
  @IsNotEmpty()
  @IsObject()
  name: NameDto;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  key: string;

}
