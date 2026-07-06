import { AbstractRepository, CustomerDebtsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomerDebtsRepository extends AbstractRepository<CustomerDebtsEntity> {
  protected readonly logger = new Logger(CustomerDebtsRepository.name);
  constructor(
    @InjectRepository(CustomerDebtsEntity)
    private readonly customerDebtsRepository: Repository<CustomerDebtsEntity>,
    dataSource: DataSource,
  ) {
    super(customerDebtsRepository, dataSource);
  }
}
