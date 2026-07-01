import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

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
  @IsEmail()
  email: string;

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
