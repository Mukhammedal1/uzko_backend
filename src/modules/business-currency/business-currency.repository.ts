import { AbstractRepository, BusinessCurrencyEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BusinessCurrencyRepository extends AbstractRepository<BusinessCurrencyEntity> {
  protected readonly logger = new Logger(BusinessCurrencyRepository.name);
  constructor(
    @InjectRepository(BusinessCurrencyEntity)
    private readonly businessCurrencyRepository: Repository<BusinessCurrencyEntity>,
    dataSource: DataSource,
  ) {
    super(businessCurrencyRepository, dataSource);
  }
}
