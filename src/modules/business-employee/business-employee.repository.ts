import { AbstractRepository, BusinessEmployeesEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class BusinessEmployeesRepository extends AbstractRepository<BusinessEmployeesEntity> {
  protected readonly logger = new Logger(BusinessEmployeesRepository.name);
  constructor(
    @InjectRepository(BusinessEmployeesEntity)
    private readonly businessEmployeesRepository: Repository<BusinessEmployeesEntity>,
    dataSource: DataSource,
  ) {
    super(businessEmployeesRepository, dataSource);
  }
}
