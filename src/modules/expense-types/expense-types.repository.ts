import { AbstractRepository, ExpenseTypesEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ExpenseTypesRepository extends AbstractRepository<ExpenseTypesEntity> {
  protected readonly logger = new Logger(ExpenseTypesRepository.name);
  constructor(
    @InjectRepository(ExpenseTypesEntity)
    private readonly expenseTypesRepository: Repository<ExpenseTypesEntity>,
    dataSource: DataSource,
  ) {
    super(expenseTypesRepository, dataSource);
  }
}
