import { Module } from '@nestjs/common';
import { BusinessEmployeeeService } from './business-employee.service';
import { BusinessEmployeeeController } from './business-employee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessEmployeesEntity } from '@database';
import { UsersModule } from 'modules/users';
import { BusinessesModule } from 'modules/businesses';
import { BusinessEmployeesRepository } from './business-employee.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusinessEmployeesEntity]),
    UsersModule,
    BusinessesModule,
  ],
  controllers: [BusinessEmployeeeController],
  providers: [BusinessEmployeeeService, BusinessEmployeesRepository],
})
export class BusinessEmployeeeModule {}
