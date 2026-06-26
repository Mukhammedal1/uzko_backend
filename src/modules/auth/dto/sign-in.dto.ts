import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class SignInDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Matches(/^998[0-9]{9}$/, {
    message: 'Phone_number must be in 998XXXXXXXXX format',
  })
  phone_number: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  password: string;
}
