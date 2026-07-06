import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesEntity } from '@database';
import { ModulesRepository } from './modules.repository';
import { FilesModule } from 'modules/files';

@Module({
  imports: [TypeOrmModule.forFeature([ModulesEntity]), FilesModule],
  controllers: [ModulesController],
  providers: [ModulesService, ModulesRepository],
  exports: [ModulesService],
})
export class ModulesModule {}
