import { AbstractRepository, SuppliersEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SuppliersRepository extends AbstractRepository<SuppliersEntity> {
  protected readonly logger = new Logger(SuppliersRepository.name);
  constructor(
    @InjectRepository(SuppliersEntity)
    private readonly suppliersRepository: Repository<SuppliersEntity>,
    dataSource: DataSource,
  ) {
    super(suppliersRepository, dataSource);
  }
}
