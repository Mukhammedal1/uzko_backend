import { Module } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CurrencyController } from './currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrencyEntity } from '@database';
import { CurrencyRepository } from './currency.repository';
import { BusinessesModule } from 'modules/businesses';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyEntity]), BusinessesModule],
  controllers: [CurrencyController],
  providers: [CurrencyService, CurrencyRepository],
  exports: [CurrencyService],
})
export class CurrencyModule {}
