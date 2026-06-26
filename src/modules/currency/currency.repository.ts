import { AbstractRepository, CurrencyEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CurrencyRepository extends AbstractRepository<CurrencyEntity> {
  protected readonly logger = new Logger(CurrencyRepository.name);
  constructor(
    @InjectRepository(CurrencyEntity)
    private readonly currencyRepository: Repository<CurrencyEntity>,
    dataSource: DataSource,
  ) {
    super(currencyRepository, dataSource);
  }
}
