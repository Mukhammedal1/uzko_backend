import { AbstractRepository, ShelfNumbersEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ShelfNumbersRepository extends AbstractRepository<ShelfNumbersEntity> {
  protected readonly logger = new Logger(ShelfNumbersRepository.name);
  constructor(
    @InjectRepository(ShelfNumbersEntity)
    private readonly shelfNumbersRepository: Repository<ShelfNumbersEntity>,
    dataSource: DataSource,
  ) {
    super(shelfNumbersRepository, dataSource);
  }
}
