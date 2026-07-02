import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailService: MailerService) {}

  async sendVerificationCodeForRegister(email: string, code: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Food Express emailni tasdiqlash kodi',
      template: './confirm-code',
      context: { code, base_url: process.env.BASE_URL },
    });
  }

  async sendVerificationCodeChangePassword(email: string, code: string) {
    await this.mailService.sendMail({
      to: email,
      subject: 'Food Express emailni tasdiqlash kodi',
      template: './reset-password-code',
      context: { code, base_url: process.env.BASE_URL },
    });
  }
}
