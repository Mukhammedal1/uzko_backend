import { AbstractRepository, PagesEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PagesRepository extends AbstractRepository<PagesEntity> {
  protected readonly logger = new Logger(PagesRepository.name);
  constructor(
    @InjectRepository(PagesEntity)
    private readonly pagesRepository: Repository<PagesEntity>,
    dataSource: DataSource,
  ) {
    super(pagesRepository, dataSource);
  }
}
