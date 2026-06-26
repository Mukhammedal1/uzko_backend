import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBusinessDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  address: string;
}
