import { AbstractRepository, SalesEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SalesRepository extends AbstractRepository<SalesEntity> {
  protected readonly logger = new Logger(SalesRepository.name);
  constructor(
    @InjectRepository(SalesEntity)
    private readonly salesRepository: Repository<SalesEntity>,
    dataSource: DataSource,
  ) {
    super(salesRepository, dataSource);
  }
}
