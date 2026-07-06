import { Module } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersEntity } from '@database';
import { BusinessesModule } from 'modules/businesses';
import { CustomersRepository } from './customers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CustomersEntity]), BusinessesModule],
  controllers: [CustomersController],
  providers: [CustomersService, CustomersRepository],
  exports: [CustomersService, CustomersRepository],
})
export class CustomersModule {}
