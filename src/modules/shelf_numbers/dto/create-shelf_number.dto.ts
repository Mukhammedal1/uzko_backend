import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateShelfNumberDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  name: string;
}
