import { Module } from '@nestjs/common';
import { UnitsService } from './units.service';
import { UnitsController } from './units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitsRepository } from './units.repository';
import { UnitsEntity } from '@database';

@Module({
  imports: [TypeOrmModule.forFeature([UnitsEntity])],
  controllers: [UnitsController],
  providers: [UnitsService, UnitsRepository],
  exports: [UnitsService, UnitsRepository],
})
export class UnitsModule {}
