import { AbstractRepository, AdminsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AdminRepository extends AbstractRepository<AdminsEntity> {
  protected readonly logger = new Logger(AdminRepository.name);
  constructor(
    @InjectRepository(AdminsEntity)
    private readonly adminRepository: Repository<AdminsEntity>,
    dataSource: DataSource,
  ) {
    super(adminRepository, dataSource);
  }
}
