import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import FormData from 'form-data';

@Injectable()
export class SmsClientService {
  private readonly logger = new Logger(SmsClientService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private async EskizLogin(): Promise<string> {
    try {
      const formData = new FormData();

      formData.append('email', this.configService.get<string>('SMS_LOGIN')!);

      formData.append(
        'password',
        this.configService.get<string>('SMS_PASSWORD')!,
      );

      const response = await lastValueFrom(
        this.httpService.post(
          `${this.configService.get<string>('SMS_BASE_URL')}/auth/login`,
          formData,
          {
            headers: formData.getHeaders(),
          },
        ),
      );

      const token = response.data?.data?.token;

      if (!token) {
        throw new BadRequestException('Eskiz token not found');
      }

      return token;
    } catch (error: any) {
      this.logger.error(
        `Eskiz Login Error = ${error.response?.data?.message || error.message}`,
      );

      throw new BadRequestException('SMS provider login failed');
    }
  }


  async sendSms(phone: string, message: string): Promise<boolean> {
    try {
      const token = await this.EskizLogin();

      const formData = new FormData();

      formData.append('mobile_phone', phone.replace('+', ''));

      formData.append('message', message);

      formData.append('from', this.configService.get<string>('SMS_FROM')!);

      const response = await lastValueFrom(
        this.httpService.post(
          `${this.configService.get<string>('SMS_BASE_URL')}/message/sms/send`,
          formData,
          {
            timeout: 5000,

            headers: {
              Authorization: `Bearer ${token}`,
              ...formData.getHeaders(),
            },
          },
        ),
      );

      this.logger.log(`SMS sent successfully | phone = ${phone}`);

      return response.status >= 200 && response.status < 300;
    } catch (error: any) {
      this.logger.error(
        `Send SMS Error = ${error.response?.data?.message || error.message}`,
      );

      throw new BadRequestException('SMS sending failed');
    }
  }
}
