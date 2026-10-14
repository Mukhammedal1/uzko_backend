import { Module } from '@nestjs/common';
import { UserPermissionsService } from './user-permissions.service';
import { UserPermissionsController } from './user-permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPermissionsEntity } from '@database';
import { UserPermissionsRepository } from './user-permissions.repository';
import { UsersModule } from 'modules/users';
import { PermissionsModule } from 'modules/permissions';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserPermissionsEntity]),
    UsersModule,
    PermissionsModule,
  ],
  controllers: [UserPermissionsController],
  providers: [UserPermissionsService, UserPermissionsRepository],
  exports: [UserPermissionsService, UserPermissionsRepository],
})
export class UserPermissionsModule {}
