import { AbstractRepository, UnitsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UnitsRepository extends AbstractRepository<UnitsEntity> {
  protected readonly logger = new Logger(UnitsRepository.name);
  constructor(
    @InjectRepository(UnitsEntity)
    private readonly unitsRepository: Repository<UnitsEntity>,
    dataSource: DataSource,
  ) {
    super(unitsRepository, dataSource);
  }
}
