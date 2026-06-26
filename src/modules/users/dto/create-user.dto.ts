import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
 @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  business_id: number;

}
