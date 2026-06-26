import { AppConfig } from "@interfaces";

export const appConfig: AppConfig = {
  port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
  production: process.env.APP_PRODUCTION
    ? process.env.APP_PRODUCTION === 'true'
    : false,
  passpwordHashKey: process.env.PASSWORD_HASH_KEY,
  jwtAccessSecretKey: process.env.JWT_ACCESS_SECRET_KEY,
  jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
  jwtAccessExpires: '15m',
  jwtRefreshExpires: '1d',
};
