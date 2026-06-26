import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModulesEntity } from '@database';
import { ModulesRepository } from './modules.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ModulesEntity])],
  controllers: [ModulesController],
  providers: [ModulesService, ModulesRepository],
  exports: [ModulesService],
})
export class ModulesModule {}
