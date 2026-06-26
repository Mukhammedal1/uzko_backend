import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class NameDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  uz: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  ru: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  uz_cryl: string;
}
