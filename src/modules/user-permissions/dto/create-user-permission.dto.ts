import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserPermissionDto {

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  @IsNumber()
  permission_id: number;
}
