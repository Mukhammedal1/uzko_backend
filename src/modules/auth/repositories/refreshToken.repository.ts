import { AbstractRepository, RefreshTokensEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class RefreshTokenRepository extends AbstractRepository<RefreshTokensEntity> {
  protected readonly logger = new Logger(RefreshTokenRepository.name);
  constructor(
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokensEntity>,
    dataSource: DataSource,
  ) {
    super(refreshTokenRepository, dataSource);
  }
}
