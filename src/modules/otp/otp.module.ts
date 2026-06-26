import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpEntity } from '@database';
import { OtpRepository } from './otp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OtpEntity])],
  controllers: [],
  providers: [OtpRepository],
  exports: [OtpRepository],
})
export class OtpModule {}
