import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { appConfig } from '@configs';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { OtpModule } from 'modules/otp';
import { SmsClientModule } from '@clients';
import { UsersModule } from 'modules/users';
import { BusinessesModule } from 'modules/businesses';
import { AgentsModule } from 'modules/agents';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: appConfig.jwtAccessSecretKey,
          signOptions: {
            expiresIn: appConfig.jwtAccessExpires as StringValue,
          },
        };
      },
    }),
    OtpModule,
    SmsClientModule,
    UsersModule,
    BusinessesModule,
    AgentsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
