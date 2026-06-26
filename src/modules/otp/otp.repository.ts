import { AbstractRepository, OtpEntity } from '@database';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class OtpRepository extends AbstractRepository<OtpEntity> {
  protected readonly logger = new Logger(OtpRepository.name);
  constructor(
    @InjectRepository(OtpEntity)
    private readonly otpRepository: Repository<OtpEntity>,
    dataSource: DataSource,
  ) {
    super(otpRepository, dataSource);
  }
}
