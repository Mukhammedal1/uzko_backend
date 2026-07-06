import { Module } from '@nestjs/common';
import { CustomerDebtPaymentsService } from './customer-debt-payments.service';
import { CustomerDebtPaymentsController } from './customer-debt-payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerDebtPaymentsEntity } from '@database';
import { CustomerDebtPaymentsRepository } from './customer-debt-payments.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerDebtPaymentsEntity])],
  controllers: [CustomerDebtPaymentsController],
  providers: [CustomerDebtPaymentsService, CustomerDebtPaymentsRepository],
})
export class CustomerDebtPaymentsModule {}
