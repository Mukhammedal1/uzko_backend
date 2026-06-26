import { AbstractRepository, AgentsEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AgentsRepository extends AbstractRepository<AgentsEntity> {
  protected readonly logger = new Logger(AgentsRepository.name);
  constructor(
    @InjectRepository(AgentsEntity)
    private readonly agentsRepository: Repository<AgentsEntity>,
    dataSource: DataSource,
  ) {
    super(agentsRepository, dataSource);
  }
}
