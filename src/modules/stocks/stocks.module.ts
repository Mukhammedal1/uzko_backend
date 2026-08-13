import { Module } from '@nestjs/common';
import { StocksService } from './stocks.service';
import { StocksController } from './stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StocksEntity } from '@database';
import { BusinessesModule } from 'modules/businesses';
import { StocksRepository } from './stocks.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StocksEntity]), BusinessesModule],
  controllers: [StocksController],
  providers: [StocksService, StocksRepository],
  exports: [StocksService],
})
export class StocksModule {}
