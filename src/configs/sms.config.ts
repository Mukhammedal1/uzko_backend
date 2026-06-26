import { SmsConfig } from '@interfaces';

export const smsConfig: SmsConfig = {
  SMS_LOGIN: process.env.SMS_LOGIN,
  SMS_PASSWORD: process.env.SMS_PASSWORD,
  SMS_URL: process.env.SMS_URL,
};
