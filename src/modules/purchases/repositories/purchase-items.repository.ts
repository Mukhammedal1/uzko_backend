import { AbstractRepository, PurchaseItemsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PurchaseItemsRepository extends AbstractRepository<PurchaseItemsEntity> {
  protected readonly logger = new Logger(PurchaseItemsRepository.name);
  constructor(
    @InjectRepository(PurchaseItemsEntity)
    private readonly purchaseItemsRepository: Repository<PurchaseItemsEntity>,
    dataSource: DataSource,
  ) {
    super(purchaseItemsRepository, dataSource);
  }
}
