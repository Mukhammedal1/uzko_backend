import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgentDto {
  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  agent_code: string;

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  agent_name: string;
}
