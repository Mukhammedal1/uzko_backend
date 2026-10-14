import { AbstractRepository, ProductVariantBarcodesEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductVariantBarcodesRepository extends AbstractRepository<ProductVariantBarcodesEntity> {
  protected readonly logger = new Logger(ProductVariantBarcodesRepository.name);
  constructor(
    @InjectRepository(ProductVariantBarcodesEntity)
    private readonly productVariantBarcodesRepository: Repository<ProductVariantBarcodesEntity>,
    dataSource: DataSource,
  ) {
    super(productVariantBarcodesRepository, dataSource);
  }
}
