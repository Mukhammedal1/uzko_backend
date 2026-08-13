import { AbstractRepository, StocksEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class StocksRepository extends AbstractRepository<StocksEntity> {
  protected readonly logger = new Logger(StocksRepository.name);
  constructor(
    @InjectRepository(StocksEntity)
    private readonly stocksRepository: Repository<StocksEntity>,
    dataSource: DataSource,
  ) {
    super(stocksRepository, dataSource);
  }
}
