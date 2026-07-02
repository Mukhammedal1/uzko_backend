import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reset_otp_token: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,20}$/, {
    message:
      'Password must be between 6 and 20 characters long and contain at least 1 uppercase letter, 1 number, and 1 special character',
  })
  new_password: string;
}
