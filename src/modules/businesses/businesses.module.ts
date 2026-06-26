import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessesEntity } from '@database';
import { BusinessesRepository } from './businesses.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BusinessesEntity])],
  controllers: [BusinessesController],
  providers: [BusinessesService, BusinessesRepository],
  exports: [BusinessesService, BusinessesRepository],
})
export class BusinessesModule {}
