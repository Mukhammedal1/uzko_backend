import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsEntity } from '@database';
import { PermissionsRepository } from './permissions.repository';
import { ModulesModule } from 'modules/modules';
import { PagesModule } from 'modules/pages';

@Module({
  imports: [
    TypeOrmModule.forFeature([PermissionsEntity]),
    ModulesModule,
    PagesModule,
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsService, PermissionsRepository],
})
export class PermissionsModule {}
