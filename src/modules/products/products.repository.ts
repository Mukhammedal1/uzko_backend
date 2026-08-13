import { AbstractRepository, ProductsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProductsRepository extends AbstractRepository<ProductsEntity> {
  protected readonly logger = new Logger(ProductsRepository.name);
  constructor(
    @InjectRepository(ProductsEntity)
    private readonly productsRepository: Repository<ProductsEntity>,
    dataSource: DataSource,
  ) {
    super(productsRepository, dataSource);
  }
}
