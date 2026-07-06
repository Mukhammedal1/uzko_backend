import { Module } from '@nestjs/common';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalesEntity } from '@database';
import { SalesRepository } from './sales.repository';
import { UsersModule } from 'modules/users';
import { CustomersModule } from 'modules/customers';
import { BusinessesModule } from 'modules/businesses';

@Module({
  imports: [
    TypeOrmModule.forFeature([SalesEntity]),
    UsersModule,
    CustomersModule,
    BusinessesModule,
  ],
  controllers: [SalesController],
  providers: [SalesService, SalesRepository],
  exports: [SalesService, SalesRepository],
})
export class SalesModule {}
