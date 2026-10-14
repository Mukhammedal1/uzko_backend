import { AbstractRepository, PurchasesEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PurchasesRepository extends AbstractRepository<PurchasesEntity> {
  protected readonly logger = new Logger(PurchasesRepository.name);
  constructor(
    @InjectRepository(PurchasesEntity)
    private readonly purchasesRepository: Repository<PurchasesEntity>,
    dataSource: DataSource,
  ) {
    super(purchasesRepository, dataSource);
  }
}
