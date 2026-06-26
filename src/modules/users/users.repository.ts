import { AbstractRepository, UsersEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class UsersRepository extends AbstractRepository<UsersEntity> {
  protected readonly logger = new Logger(UsersRepository.name);
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    dataSource: DataSource,
  ) {
    super(usersRepository, dataSource);
  }
}
