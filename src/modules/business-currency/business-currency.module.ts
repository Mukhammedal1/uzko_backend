import { forwardRef, Module } from '@nestjs/common';
import { BusinessCurrencyService } from './business-currency.service';
import { BusinessCurrencyController } from './business-currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessCurrencyEntity } from '@database';
import { BusinessCurrencyRepository } from './business-currency.repository';
import { BusinessesModule } from 'modules/businesses';
import { CurrencyModule } from 'modules/currency';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessCurrencyEntity]),
    BusinessesModule,
    CurrencyModule,
  ],
  controllers: [BusinessCurrencyController],
  providers: [BusinessCurrencyService, BusinessCurrencyRepository],
  exports: [BusinessCurrencyService, BusinessCurrencyRepository],
})
export class BusinessCurrencyModule {}
