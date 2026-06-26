import { AbstractRepository, CustomersEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CustomersRepository extends AbstractRepository<CustomersEntity> {
  protected readonly logger = new Logger(CustomersRepository.name);
  constructor(
    @InjectRepository(CustomersEntity)
    private readonly customersRepository: Repository<CustomersEntity>,
    dataSource: DataSource,
  ) {
    super(customersRepository, dataSource);
  }
}
