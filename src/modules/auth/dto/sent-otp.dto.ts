import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SentOtpDto {
  @ApiProperty({ example: 'odiljonovmuhammadali742@gmail.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
