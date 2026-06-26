import { AbstractRepository, BusinessesEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BusinessesRepository extends AbstractRepository<BusinessesEntity> {
  protected readonly logger = new Logger(BusinessesRepository.name);
  constructor(
    @InjectRepository(BusinessesEntity)
    private readonly businessesRepository: Repository<BusinessesEntity>,
    dataSource: DataSource,
  ) {
    super(businessesRepository, dataSource);
  }
}
