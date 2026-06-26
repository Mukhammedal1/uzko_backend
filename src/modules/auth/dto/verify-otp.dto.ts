import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: '998901231212' })
  @IsNotEmpty()
  @IsPhoneNumber('UZ', {
    message: 'Please enter a valid phone number: 998901234567',
  })
  phone_number: string;

  @ApiProperty({ example: '12345' })
  @IsNotEmpty()
  @IsNumber()
  confirmCode: number;
}
