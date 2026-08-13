import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { AgentsRepository } from 'modules/agents';
import * as bcrypt from 'bcrypt';
import {
  BusinessEmployeesEntity,
  BusinessesEntity,
  ModulesEntity,
  PagesEntity,
  PermissionsEntity,
  UserPermissionsEntity,
  UsersEntity,
} from '@database';
import { PERMISSION_TYPE, USER_TYPE } from '@enums';
import { MailService } from 'modules/mail';
import { OtpRepository, RefreshTokenRepository } from './repositories';
import { RedisService, TTL_FOR_OTP, TTL_FOR_REGISTER } from '@infrastructure';
import { UserPermissionsRepository } from 'modules/user-permissions/user-permissions.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly businessesRepository: BusinessesRepository,
    private readonly otpRepository: OtpRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly agentsRepository: AgentsRepository,
    private readonly mailService: MailService,
    private readonly redisService: RedisService,
    private readonly userPermissionRepository: UserPermissionsRepository,
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

  async sentOtp(email: string) {
    const otp_key = `otp:register:${email}`;

    const existed_otp = await this.redisService.get(otp_key);
    if (existed_otp) {
      const ttlSeconds = await this.redisService.getTTL(otp_key);
      if (ttlSeconds > 0) {
        throw new BadRequestException(
          `Iltimos ${formatWaitTime(ttlSeconds)} dan keyin qayta urinib ko'ring`,
        );
      }
    }
    const code = RandomCodeGenerate();
    const hashed_code = await bcrypt.hash(code, 7);

    try {
      await this.mailService.sendVerificationCodeForRegister(email, code);
    } catch (error) {
      await this.otpRepository.hardDelete({ email });
      throw new InternalServerErrorException(
        'Tasdiqlash kodini yuborishda xatolik yuz berdi, internetga ulanishni tekshiring',
      );
    }

    await this.redisService.set(otp_key, { code: hashed_code }, TTL_FOR_OTP);

    return { message: 'Code was sent succesfully' };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { email, code } = verifyOtpDto;
    const otp_key = `otp:register:${email}`;

    const otp = await this.redisService.get<{ code: string }>(otp_key);

    if (!otp) {
      throw new BadRequestException('Tasdiqlash kodi yaroqsiz');
    }

    const isMatch = await bcrypt.compare(code, otp.code);

    if (!isMatch) {
      throw new BadRequestException('Tasdiqlash kodi yaroqsiz');
    }

    const register_key = `register:business:${email}`;
    const registerData = await this.redisService.get<any>(register_key);

    if (!registerData) {
      throw new BadRequestException(
        "Ro'yxatdan o'tish ma'lumotlari topilmadi, qaytadan boshlang",
      );
    }

    const user = await this.usersRepository.withTransaction(async (manager) => {
      const business = await manager.save(BusinessesEntity, {
        company_name: registerData.company_name,
        agent_id: registerData.agent_id,
      });

      const user = await manager.save(UsersEntity, {
        email: email,
        hashed_password: registerData.password,
        user_type: USER_TYPE.BUSINESS_OWNER,
        business_id: business.id,
      });

      const business_employee = await manager.save(BusinessEmployeesEntity, {
        first_name: registerData.owner_name,
        business_id: business.id,
        user_id: user.id,
      });

      const permissions = await manager.find(PermissionsEntity, {
        where: { permission_type: PERMISSION_TYPE.BUSINESS },
      });
      if (!permissions) {
        throw new NotFoundException('permissions not found');
      }

      await manager.insert(
        UserPermissionsEntity,
        permissions.map((permission) => ({
          user_id: user.id,
          permission_id: permission.id,
        })),
      );

      return user;
    });

    return { message: 'Register is successfuly' };
  }

  async registerBusiness(registerBusinessDto: RegisterBusinessDto) {
    const { agent_code, password, company_name, email, owner_name } =
      registerBusinessDto;

    // ---------- verify agent_code ---------------------------------
    const agent = await this.verifyAgentCode({ agent_code });

    // ----------- existed user -------------------------------------
    const existUser = await this.usersRepository.findOne(
      { email },
      { withDeleted: true },
    );
    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.redisService.set(
      `register:business:${email}`,
      {
        agent_id: agent.id,
        password: hashedPassword,
        company_name,
        email,
        owner_name,
      },
      TTL_FOR_REGISTER,
    );

    return await this.sentOtp(email);
  }

  async signin(signinDto: SignInDto) {
    const { email, password } = signinDto;
    const user = await this.usersRepository.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Telefon raqam yoki parol xato');
    }
    const matchedPassword = await bcrypt.compare(
      password,
      user.hashed_password,
    );
    if (!matchedPassword) {
      throw new UnauthorizedException('Telefon raqam yoki parol xato');
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
    const userPermissions = await this.userPermissionRepository.find({
      where: { user_id: id },
      relations: { permission: { page: true, module: { icon: true } } },
    });

    return {
      user_id: user.id,
      business_id: user.business_id,
      role: user.user_type,
      [user.user_type]: profile,
      ...this.buildPermissions(userPermissions),
    };
  }

  async forgetPassword(forgetPasswordDto: ForgetPasswordDto) {
    const { email } = forgetPasswordDto;
    console.log(email);

    const user = await this.usersRepository.findOne({ email });
    if (user) {
      const code = RandomCodeGenerate();
      const hashed_code = await bcrypt.hash(code, 7);
      const otp_key = `otp:reset_password:${email}`;
      const otp = await this.redisService.get<any>(otp_key);
      console.log(otp);

      if (otp) {
        const ttlSeconds = await this.redisService.getTTL(otp_key);
        if (ttlSeconds > 0) {
          throw new BadRequestException(
            `Iltimos ${formatWaitTime(ttlSeconds)} dan keyin qayta urinib ko'ring`,
          );
        }
      }
      try {
        await this.mailService.sendVerificationCodeChangePassword(email, code);
      } catch (error) {
        await this.redisService.delete(otp_key);
        throw new InternalServerErrorException(
          'Tasdiqlash kodini yuborishda xatolik yuz berdi',
        );
      }
      await this.redisService.set(otp_key, { code: hashed_code }, TTL_FOR_OTP);
    }
    return { message: 'Code sent successfully!' };
  }

  async verifyOtpResetPassword(verifyOtpDto: VerifyOtpDto) {
    const { email, code } = verifyOtpDto;

    const otp_key = `otp:reset_password:${email}`;

    const otp = await this.redisService.get<any>(otp_key);

    if (!otp) {
      throw new BadRequestException('Tasdiqlash kodi yaroqsiz');
    }

    const isMatch = await bcrypt.compare(code, otp.code);

    if (!isMatch) {
      throw new BadRequestException('Tasdiqlash kodi yaroqsiz');
    }

    return { message: 'Email confirmation is successfuly' };
  }

  async resetPassword(changePasswordDto: ChangePasswordDto) {
    const { email, new_password } = changePasswordDto;

    const user = await this.usersRepository.findOneOrFail({ email });

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

  private buildPermissions(userPermissions: UserPermissionsEntity[]) {
    const modules = new Map<
      number,
      { id: number; name: any; key: string; icon: any; order: number }
    >();
    const pages = new Map<
      number,
      { id: number; name: any; key: string; module_id: number; order: number }
    >();
    const permissions: string[] = [];

    for (const up of userPermissions) {
      const permission = up.permission;
      const page = permission?.page;
      const module = permission?.module;

      if (module && !modules.has(module.id)) {
        modules.set(module.id, {
          id: module.id,
          name: module.name,
          key: module.key,
          icon: module.icon,
          order: module.order,
        });
      }

      if (page && !pages.has(page.id)) {
        pages.set(page.id, {
          id: page.id,
          name: page.name,
          key: page.key,
          module_id: page.module_id,
          order: page.order,
        });
      }
      if (permission) {
        permissions.push(permission.key);
      }
    }

    return {
      modules: [...modules.values()].sort((a, b) => a.order - b.order),
      pages: [...pages.values()].sort((a, b) => a.order - b.order),
      permissions,
    };
  }
}
