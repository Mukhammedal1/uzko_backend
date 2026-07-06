import { FilesEntity } from "@infrastructure";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AbstractRepository } from "infrastructure/database/abstract.repository";
import { DataSource, Repository } from "typeorm";

@Injectable()
export class FilesRepository extends AbstractRepository<FilesEntity> {
  protected readonly logger = new Logger(FilesRepository.name);

  constructor(
    @InjectRepository(FilesEntity)
    private readonly filesRepo: Repository<FilesEntity>,
    dataSource: DataSource
  ) {
    super(filesRepo, dataSource);
  }
}
