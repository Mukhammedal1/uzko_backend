import { Module } from '@nestjs/common';
import { ExpenseTypesService } from './expense-types.service';
import { ExpenseTypesController } from './expense-types.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseTypesEntity } from '@database';
import { ExpenseTypesRepository } from './expense-types.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ExpenseTypesEntity])],
  controllers: [ExpenseTypesController],
  providers: [ExpenseTypesService, ExpenseTypesRepository],
})
export class ExpenseTypesModule {}
