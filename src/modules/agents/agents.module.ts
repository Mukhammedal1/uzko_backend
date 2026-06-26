import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgentsEntity } from '@database';
import { AgentsRepository } from './agents.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AgentsEntity])],
  controllers: [AgentsController],
  providers: [AgentsService, AgentsRepository],
  exports: [AgentsService, AgentsRepository],
})
export class AgentsModule {}
