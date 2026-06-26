import { Module } from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { UserPermissionsController } from './user-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionsEntity } from '@database';
import { UserPermissionsRepository } from './user-permissions.repository';
import { UsersModule } from 'modules/users';
import { PagesModule } from 'modules/pages';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPermissionsEntity]),
    UsersModule,
    PagesModule,
  ],
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService, UserPermissionsRepository],
  exports: [UserPermissionsService],
})
export class UserPermissionsModule {}
