import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import {
  RegisterBusinessDto,
  SentOtpDto,
  SignInDto,
  VerifyAgentCodeDto,
  VerifyOtpDto,
} from './dto';

@ApiTags('Auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-agentcode')
  async verifyAgentCode(@Body() verifyAgentCodeDto: VerifyAgentCodeDto) {
    return await this.authService.verifyAgentCode(verifyAgentCodeDto);
  }

  @Post('sent-otp')
  async sentOtp(@Body() sentOtpDto: SentOtpDto) {
    return await this.authService.sentOtp(sentOtpDto);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @Post('register')
  registerBusiness(@Body() registerBusinessDto: RegisterBusinessDto) {
    return this.authService.registerBusiness(registerBusinessDto);
  }

  @Post('signin')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signin(signInDto);
  }
}
