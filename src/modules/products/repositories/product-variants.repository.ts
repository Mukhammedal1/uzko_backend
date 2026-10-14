import { AbstractRepository, ProductVariantsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductVariantsRepository extends AbstractRepository<ProductVariantsEntity> {
  protected readonly logger = new Logger(ProductVariantsRepository.name);
  constructor(
    @InjectRepository(ProductVariantsEntity)
    private readonly productVariantsRepository: Repository<ProductVariantsEntity>,
    dataSource: DataSource,
  ) {
    super(productVariantsRepository, dataSource);
  }
}
