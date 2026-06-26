import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  RegisterBusinessDto,
  SentOtpDto,
  SignInDto,
  VerifyAgentCodeDto,
  VerifyOtpDto,
} from './dto';
import { UsersRepository } from 'modules/users';
import { BusinessesRepository } from 'modules/businesses';
import { RandomCodeGenerate } from '@utils';
import { SmsClientService } from 'infrastructure/clients/sms';
import { OtpRepository } from 'modules/otp';
import { JwtService } from '@nestjs/jwt';
import { AgentsRepository } from 'modules/agents';
import * as bcrypt from 'bcrypt';
import {
  BusinessesEntity,
  PagesEntity,
  UserPermissionsEntity,
  UsersEntity,
} from '@database';
import { USER_TYPE } from '@enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly businessesRepository: BusinessesRepository,
    private readonly smsClientService: SmsClientService,
    private readonly otpRepository: OtpRepository,
    private readonly jwtService: JwtService,
    private readonly usersRepository: UsersRepository,
    private readonly agentsRepository: AgentsRepository,
  ) {}

  async verifyAgentCode(verifyAgentCodeDto: VerifyAgentCodeDto) {
    const agent = await this.agentsRepository.findOne({
      agent_code: verifyAgentCodeDto.agent_code,
    });
    if (!agent) {
      throw new UnauthorizedException('Invalid agent code');
    }
    return { success: true };
  }

  async sentOtp(sentOtpDto: SentOtpDto) {
    const { phone_number } = sentOtpDto;

    const code = RandomCodeGenerate();

    await this.smsClientService.sendSms(
      phone_number,
      'This is test from Eskiz',
    );

    await this.otpRepository.hardDelete({ phone_number });

    await this.otpRepository.create({
      phone_number,
      code,
      expire_date: new Date(Date.now() + 2 * 60 * 1000),
    });

    return { message: 'Code was sent succesfully', code };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const { phone_number, confirmCode } = verifyOtpDto;
    const existed = await this.otpRepository.findOne({
      phone_number,
      code: confirmCode,
    });
    if (!existed) {
      throw new BadRequestException('Invalid code');
    }
    if (existed && existed.expire_date < new Date()) {
      await this.otpRepository.hardDelete({ phone_number, code: confirmCode });
      throw new UnauthorizedException('Your code is expired. please resend it');
    }
    await this.otpRepository.hardDelete({ phone_number, code: confirmCode });

    return {
      otp_token: this.generateVerifyOtpToken(phone_number),
    };
  }

  async registerBusiness(registerBusinessDto: RegisterBusinessDto) {
    const {
      otp_token,
      agent_code,
      password,
      company_name,
      phone_number,
      owner_name,
    } = registerBusinessDto;

    // ---------- token verify -------------------------------------
    let payload: any;
    try {
      payload = this.jwtService.verify(otp_token);
    } catch (error) {
      throw new UnauthorizedException('Token is invalid or expired');
    }
    if (payload.purpose !== 'registration') {
      throw new UnauthorizedException('Token is invalid or expired');
    }
    if (payload.phone_number !== phone_number) {
      throw new UnauthorizedException('Phone number does not match');
    }

    // ----------- existed user -------------------------------------
    const existUser = await this.usersRepository.findOne({ phone_number });
    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    // ----------- check agent code ----------------------------------
    const agent = await this.agentsRepository.findOneOrFail({ agent_code });

    // ------------ hashed password ------------------------------------
    const hashedPassword = await bcrypt.hash(password, 7);

    // ------------- user create ----------------------------------------
    const user = await this.usersRepository.withTransaction(async (manager) => {
      const business = await manager.save(BusinessesEntity, {
        company_name,
        agent_id: agent.id,
      });

      const user = await manager.save(UsersEntity, {
        name: owner_name,
        phone_number,
        hashed_password: hashedPassword,
        user_type: USER_TYPE.BUSINESS_OWNER,
        business_id: business.id,
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
    const { phone_number, password } = signinDto;
    const user = await this.usersRepository.findOne(
      { phone_number },
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

    const payload = {
      id: user.id,
      phone_number: user.phone_number,
      user_type: user.user_type,
      business_id: user.business_id,
    };

    const access_token = this.jwtService.sign(payload, { expiresIn: '1d' });
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      access_token,
      refresh_token,
      user_id: user.id,
      business_id: user.business_id,
      permissions: this.formatPermissions(user.user_permissions),
    };
  }

  private generateVerifyOtpToken(phone_number: string) {
    return this.jwtService.sign(
      { phone_number, purpose: 'registration' },
      { expiresIn: '1m' },
    );
  }

  private formatPermissions(userPermissions: any[]) {
    const map = new Map<
      number,
      { module_id: number; module_key: string; module_name: any; pages: any[] }
    >();

    for (const up of userPermissions) {
      const { id, key, name, module } = up.permission;

      if (!map.has(module.id)) {
        map.set(module.id, {
          module_id: module.id,
          module_key: module.key,
          module_name: module.name,
          pages: [],
        });
      }

      map.get(module.id)!.pages.push({
        page_id: id,
        page_key: key,
        page_name: name,
      });
    }

    return Array.from(map.values());
  }
}
