import { Module } from '@nestjs/common';
import { CustomerDebtsService } from './customer-debts.service';
import { CustomerDebtsController } from './customer-debts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerDebtsEntity } from '@database';
import { CustomerDebtsRepository } from './customer-debts.repository';
import { SalesModule } from 'modules/sales';
import { CustomersModule } from 'modules/customers';
import { BusinessesModule } from 'modules/businesses';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerDebtsEntity]),
    SalesModule,
    CustomersModule,
    BusinessesModule,
  ],
  controllers: [CustomerDebtsController],
  providers: [CustomerDebtsService, CustomerDebtsRepository],
  exports: [CustomerDebtsService, CustomerDebtsRepository],
})
export class CustomerDebtsModule {}
