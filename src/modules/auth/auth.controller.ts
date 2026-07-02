import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ChangePasswordDto,
  ForgetPasswordDto,
  RefreshTokenDto,
  RegisterBusinessDto,
  SentOtpDto,
  SignInDto,
  VerifyAgentCodeDto,
  VerifyOtpDto,
} from './dto';
import { CurrentUser } from '@common';
import { UsersEntity } from '@database';

@ApiTags('Auth')
@Controller({ version: '1', path: 'auth' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

  @Post('forget-password')
  forgetPassword(@Body() forgetPasswordDto: ForgetPasswordDto) {
    return this.authService.forgetPassword(forgetPasswordDto);
  }

  @Post('verifyotp-resetpassword')
  verifyOtpResetPassword(@Body() verifyOtpdto: VerifyOtpDto) {
    return this.authService.verifyOtpResetPassword(verifyOtpdto);
  }

  @Post('change-password')
  resetPassword(@Body() changePassword: ChangePasswordDto) {
    return this.authService.resetPassword(changePassword);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() currenUser: UsersEntity) {
    return this.authService.getMe(currenUser.id);
  }

  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard)
  @Post('signout')
  signout(@CurrentUser() user: UsersEntity) {
    return this.authService.signOut(user.id);
  }

  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }
}
