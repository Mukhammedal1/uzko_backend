import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SmsClientModule } from '@clients';
import { UsersModule } from 'modules/users';
import { BusinessesModule } from 'modules/businesses';
import { AgentsModule } from 'modules/agents';
import { MailModule } from 'modules/mail';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity, RefreshTokensEntity } from '@database';
import { OtpRepository, RefreshTokenRepository } from './repositories';

@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([OtpEntity, RefreshTokensEntity]),
    SmsClientModule,
    UsersModule,
    BusinessesModule,
    AgentsModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, OtpRepository, RefreshTokenRepository],
})
export class AuthModule {}
