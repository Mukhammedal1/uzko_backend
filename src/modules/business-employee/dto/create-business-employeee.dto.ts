import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBusinessEmployeeeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;
}
