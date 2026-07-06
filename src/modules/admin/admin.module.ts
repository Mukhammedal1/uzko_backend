import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminsEntity } from '@database';
import { UsersModule } from 'modules/users';
import { AdminRepository } from './admin.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AdminsEntity]), UsersModule],
  controllers: [AdminController],
  providers: [AdminService, AdminRepository],
})
export class AdminModule {}
