import { AbstractRepository, ModulesEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ModulesRepository extends AbstractRepository<ModulesEntity> {
  protected readonly logger = new Logger(ModulesRepository.name);
  constructor(
    @InjectRepository(ModulesEntity)
    private readonly modulesRepository: Repository<ModulesEntity>,
    dataSource: DataSource,
  ) {
    super(modulesRepository, dataSource);
  }
}
