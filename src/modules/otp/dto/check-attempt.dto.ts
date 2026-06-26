import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsPhoneNumber } from 'class-validator';

export class CheckAttemptDto {
  @ApiProperty({ type: String, example: '998901231212' })
  @IsNotEmpty()
  @IsPhoneNumber('UZ', { message: 'Please enter a valid phone number' })
  phone_number: string;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  code: number;
}
