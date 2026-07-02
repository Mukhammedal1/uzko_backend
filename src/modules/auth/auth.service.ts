import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
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
import { UsersRepository } from 'modules/users';
import { BusinessesRepository } from 'modules/businesses';
import { formatWaitTime, RandomCodeGenerate } from '@utils';
import { SmsClientService } from 'infrastructure/clients/sms';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AgentsRepository } from 'modules/agents';
import * as bcrypt from 'bcrypt';
import {
  BusinessEmployeesEntity,
  BusinessesEntity,
  ModulesEntity,
  PagesEntity,
  UserPermissionsEntity,
  UsersEntity,
} from '@database';
import { USER_TYPE } from '@enums';
import { MailService } from 'modules/mail';
import { OtpRepository, RefreshTokenRepository } from './repositories';

@Injectable()
export class AuthService {
  constructor(
    private readonly businessesRepository: BusinessesRepository,
    private readonly smsClientService: SmsClientService,
    private readonly otpRepository: OtpRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly agentsRepository: AgentsRepository,
    private readonly mailService: MailService,
  ) {}

  async verifyAgentCode(verifyAgentCodeDto: VerifyAgentCodeDto) {
    const agent = await this.agentsRepository.findOne({
      agent_code: verifyAgentCodeDto.agent_code,
    });
    if (!agent) {
      throw new UnauthorizedException('Invalid agent code');
    }
    return agent;
  }

  async sentOtp(sentOtpDto: SentOtpDto) {
    const { email } = sentOtpDto;
    const existUser = await this.usersRepository.findOne({ email });
    if (existUser) {
      throw new BadRequestException('user already exists');
    }
    const existedOtp = await this.otpRepository.findOne({
      email,
      purpose: 'register',
    });
    if (existedOtp) {
      const now = Date.now();
      const expires_at = new Date(existedOtp.expires_at).getTime();
      if (now < expires_at) {
        const waitSeconds = Math.ceil((expires_at - now) / 1000);
        throw new BadRequestException(
          `Please wait ${formatWaitTime(waitSeconds)} seconds before requesting a new code`,
        );
      }
    }
    const code = RandomCodeGenerate();
    const hashed_code = await bcrypt.hash(code, 7);
    await this.otpRepository.hardDelete({ email, purpose: 'register' });

    await this.otpRepository.create({
      email,
      code: hashed_code,
      purpose: 'register',
      expires_at: new Date(Date.now() + 3 * 60 * 1000),
    });

    try {
      await this.mailService.sendVerificationCodeForRegister(email, code);
    } catch (error) {
      await this.otpRepository.hardDelete({ email });
      throw new InternalServerErrorException(
        'Tasdiqlash kodini yuborishda xatolik yuz berdi',
      );
    }

    return { message: 'Code was sent succesfully', code };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, code } = verifyOtpDto;

    const otp = await this.otpRepository.findOne({
      email,
      purpose: 'register',
    });

    if (!otp) {
      throw new BadRequestException('otp not found');
    }

    if (otp.expires_at < new Date()) {
      throw new BadRequestException('otp code expired');
    }

    if (otp.attempt >= 5) {
      throw new BadRequestException('Try again later');
    }

    const isMatch = await bcrypt.compare(code, otp.code);

    if (!isMatch) {
      await this.otpRepository.updateOneOrFail(
        { id: otp.id },
        {
          attempt: () => 'attempt + 1',
        },
      );
      throw new BadRequestException('Invalid otp code');
    }

    await this.otpRepository.hardDelete({ email, purpose: 'register' });

    const otpToken = this.generateTokenForOtp(email, 'register');

    return { message: 'Email confirmation is successfuly', otpToken };
  }

  async registerBusiness(registerBusinessDto: RegisterBusinessDto) {
    const { otp_token, agent_code, password, company_name, email, owner_name } =
      registerBusinessDto;

    // ---------- token verify -------------------------------------
    const payload = this.verifyOtpToken(otp_token);

    if (payload.purpose !== 'register' || payload.email !== email) {
      throw new BadRequestException("This email and otp_token doesn't match");
    }

    // ---------- verify agent_code ---------------------------------

    const agent = await this.verifyAgentCode({ agent_code });

    // ----------- existed user -------------------------------------
    const existUser = await this.usersRepository.findOne({ email });
    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    // ------------ hashed password ------------------------------------
    const hashedPassword = await bcrypt.hash(password, 7);

    // ------------- user create ----------------------------------------
    const user = await this.usersRepository.withTransaction(async (manager) => {
      const business = await manager.save(BusinessesEntity, {
        company_name,
        agent_id: agent.id,
      });

      const user = await manager.save(UsersEntity, {
        email: email,
        hashed_password: hashedPassword,
        user_type: USER_TYPE.BUSINESS_OWNER,
        business_id: business.id,
      });

      const business_employee = await manager.save(BusinessEmployeesEntity, {
        first_name: owner_name,
        business_id: business.id,
        user_id: user.id,
      });

      const pages = await manager.find(PagesEntity);

      await manager.insert(
        UserPermissionsEntity,
        pages.map((page) => ({
          user_id: user.id,
          page_id: page.id,
        })),
      );

      return user;
    });

    return user;
  }

  async signin(signinDto: SignInDto) {
    const { email, password } = signinDto;
    const user = await this.usersRepository.findOne(
      { email },
      { relations: { user_permissions: { permission: { module: true } } } },
    );
    if (!user) {
      throw new UnauthorizedException('Invalid phone numer or password');
    }
    const matchedPassword = await bcrypt.compare(
      password,
      user.hashed_password,
    );
    if (!matchedPassword) {
      throw new UnauthorizedException('Invalid phone number or password');
    }

    const tokens = await this.generateAccessRefreshTokens(user);

    const hashed_token = await bcrypt.hash(tokens.refresh_token, 7);
    await this.refreshTokenRepository.hardDelete({ user_id: user.id });
    await this.refreshTokenRepository.create({
      user_id: user.id,
      hashed_token,
      expires_at: tokens.refresh_expires_at,
    });

    return {
      user_id: user.id,
      business_id: user.business_id,
      role: user.user_type,
      ...this.buildPermissionsTree(user.user_permissions),
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  async getMe(id: number) {
    const user = await this.usersRepository.findOneOrFail(
      { id },
      { relations: { admin: true, business_employee: true } },
    );
    const { admin, business_employee, ...rest } = user;
    const profile = user.admin ?? user.business_employee ?? null;

    return {
      user_id: user.id,
      business_id: user.business_id,
      role: user.user_type,
      [user.user_type]: profile,
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { email } = forgetPasswordDto;
    const user = await this.usersRepository.findOne({ email });
    if (user) {
      const code = RandomCodeGenerate();
      const hashed_code = await bcrypt.hash(code, 7);
      await this.otpRepository.hardDelete({ email, purpose: 'reset_password' });
      await this.otpRepository.create({
        email,
        code: hashed_code,
        purpose: 'reset_password',
        expires_at: new Date(Date.now() + 3 * 60 * 1000),
      });
      try {
        await this.mailService.sendVerificationCodeChangePassword(email, code);
      } catch (error) {
        await this.otpRepository.hardDelete({
          email,
          purpose: 'reset_password',
        });
        throw new InternalServerErrorException(
          'Tasdiqlash kodini yuborishda xatolik yuz berdi',
        );
      }
    }
    return { message: 'Code sent successfully!' };
  }

  async verifyOtpResetPassword(verifyOtpDto: VerifyOtpDto) {
    const { email, code } = verifyOtpDto;

    const otp = await this.otpRepository.findOne({
      email,
      purpose: 'reset_password',
    });

    if (!otp) {
      throw new BadRequestException('Otp not found');
    }

    if (otp.expires_at < new Date()) {
      throw new BadRequestException('Otp code expired');
    }

    if (otp.attempt >= 5) {
      throw new BadRequestException('Try again later');
    }

    const isMatch = await bcrypt.compare(code, otp.code);

    if (!isMatch) {
      await this.otpRepository.updateOneOrFail(
        { id: otp.id },
        {
          attempt: () => 'attempt + 1',
        },
      );
      throw new BadRequestException('Invalid otp code');
    }

    await this.otpRepository.hardDelete({ email, purpose: 'reset_password' });

    const reset_otp_token = this.generateTokenForOtp(email, 'reset_password');

    return { message: 'Email confirmation is successfuly', reset_otp_token };
  }

  async resetPassword(changePasswordDto: ChangePasswordDto) {
    const { reset_otp_token, new_password } = changePasswordDto;

    let payload: any;
    try {
      payload = this.verifyOtpToken(reset_otp_token);
    } catch {
      throw new BadRequestException('Invalid or expired token');
    }

    if (payload.purpose !== 'reset_password') {
      throw new BadRequestException('Invalid token');
    }

    const user = await this.usersRepository.findOneOrFail(payload.email);

    const hashedPassword = await bcrypt.hash(new_password, 7);
    await this.usersRepository.updateOneOrFail(
      { id: user.id },
      { hashed_password: hashedPassword },
    );

    await this.refreshTokenRepository.hardDelete({ user_id: user.id });

    return { message: 'Password changed successfully' };
  }

  async signOut(user_id: number) {
    await this.refreshTokenRepository.hardDelete({ user_id });

    return { message: 'Signed out successfully' };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { user_id, refresh_token } = refreshTokenDto;
    let decoded: any;
    try {
      decoded = this.jwtService.verify(refresh_token, {
        secret: process.env.JWT_REFRESH_SECRET_KEY,
      });
    } catch (error) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }

    if (decoded.user_id !== user_id) {
      throw new ForbiddenException('Token does not belong to this user');
    }

    const existingToken = await this.refreshTokenRepository.findOneOrFail({
      user_id,
    });

    if (existingToken.expires_at < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    const isMatch = await bcrypt.compare(
      refresh_token,
      existingToken.hashed_token,
    );
    if (!isMatch) {
      throw new ForbiddenException('Invalid refresh token');
    }

    const user = await this.usersRepository.findOneOrFail(
      { id: user_id },
      { relations: { user_permissions: true } },
    );

    const tokens = await this.generateAccessRefreshTokens(user);
    const hashed_token = await bcrypt.hash(tokens.refresh_token, 7);

    await this.refreshTokenRepository.updateOneOrFail(
      { id: existingToken.id },
      { hashed_token, expires_at: tokens.refresh_expires_at },
    );

    return {
      user_id: user.id,
      role: user.user_type,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
    };
  }

  private generateTokenForOtp(email: string, purpose: string) {
    return this.jwtService.sign(
      { email, purpose },
      { secret: process.env.JWT_OTP_SECRET, expiresIn: '15m' },
    );
  }

  private verifyOtpToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        secret: process.env.JWT_OTP_SECRET,
      });
    } catch (error) {
      throw new BadRequestException('Invalid Otp Token');
    }
  }

  async generateAccessRefreshTokens(user: any) {
    const payload = {
      user_id: user.id,
      role: user.user_type,
      iss: 'uzko',
    };

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync({ ...payload }, {
        secret: process.env.JWT_ACCESS_SECRET_KEY,
        expiresIn: Number(process.env.JWT_ACCESS_TTL),
      } as JwtSignOptions),

      this.jwtService.signAsync({ ...payload }, {
        secret: process.env.JWT_REFRESH_SECRET_KEY,
        expiresIn: Number(process.env.JWT_REFRESH_TTL),
      } as JwtSignOptions),
    ]);

    const refresh_expires_at = new Date(
      Date.now() + Number(process.env.JWT_REFRESH_TTL) * 1000,
    );

    return { access_token, refresh_token, refresh_expires_at };
  }

  private buildPermissionsTree(userPermissions: UserPermissionsEntity[]) {
    const modules = new Map<number, { id: number; name: any; key: string }>();
    const pages = new Map<number, { id: number; name: any; key: string }>();

    for (const up of userPermissions) {
      const page = up.permission;
      const module = page?.module;

      if (module && !modules.has(module.id)) {
        modules.set(module.id, {
          id: module.id,
          name: module.name,
          key: module.key,
        });
      }

      if (page && !pages.has(page.id)) {
        pages.set(page.id, {
          id: page.id,
          name: page.name,
          key: page.key,
        });
      }
    }

    return {
      modules: [...modules.values()],
      pages: [...pages.values()],
      user_permissions: userPermissions.map(({ id, user_id, page_id }) => ({
        id,
        user_id,
        page_id,
      })),
    };
  }
}
