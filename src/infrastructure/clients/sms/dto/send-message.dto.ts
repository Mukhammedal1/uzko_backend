import { IsNotEmpty, IsPhoneNumber, IsString } from "class-validator";

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber("UZ")
  phone: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
