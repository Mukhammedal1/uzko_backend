import { AbstractRepository, CustomerDebtPaymentsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomerDebtPaymentsRepository extends AbstractRepository<CustomerDebtPaymentsEntity> {
  protected readonly logger = new Logger(CustomerDebtPaymentsRepository.name);
  constructor(
    @InjectRepository(CustomerDebtPaymentsEntity)
    private readonly customerDebtPaymentsRepository: Repository<CustomerDebtPaymentsEntity>,
    dataSource: DataSource,
  ) {
    super(customerDebtPaymentsRepository, dataSource);
  }
}
