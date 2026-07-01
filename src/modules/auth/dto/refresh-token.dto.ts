import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
