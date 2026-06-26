import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class SentOtpDto {
  @ApiProperty({ example: '998901231212' })
  @IsNotEmpty()
  @IsPhoneNumber('UZ', {
    message: 'Please enter a valid phone number: 998901234567',
  })
  phone_number: string;
}
