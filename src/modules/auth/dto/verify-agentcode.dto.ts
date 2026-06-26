import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAgentCodeDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  agent_code: string;
}
