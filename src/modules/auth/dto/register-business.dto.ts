import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class RegisterBusinessDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  owner_name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  @Matches(/^998[0-9]{9}$/, {
    message: 'Phone_number must be in +998XXXXXXXXX format',
  })
  phone_number: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  otp_token: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsString()
  agent_code: string;
}
