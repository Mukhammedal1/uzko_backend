import { AbstractRepository, UserPermissionsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UserPermissionsRepository extends AbstractRepository<UserPermissionsEntity> {
  protected readonly logger = new Logger(UserPermissionsRepository.name);
  constructor(
    @InjectRepository(UserPermissionsEntity)
    private readonly userPermissionsRepository: Repository<UserPermissionsEntity>,
    dataSource: DataSource,
  ) {
    super(userPermissionsRepository, dataSource);
  }
}
