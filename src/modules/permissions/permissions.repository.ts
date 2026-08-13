import { AbstractRepository, PermissionsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class PermissionsRepository extends AbstractRepository<PermissionsEntity> {
  protected readonly logger = new Logger(PermissionsRepository.name);
  constructor(
    @InjectRepository(PermissionsEntity)
    private readonly permissionsRepository: Repository<PermissionsEntity>,
    dataSource: DataSource,
  ) {
    super(permissionsRepository, dataSource);
  }
}
