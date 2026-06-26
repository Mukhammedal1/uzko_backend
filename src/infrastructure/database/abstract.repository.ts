import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  DataSource,
  DeepPartial,
  EntityManager,
  FindManyOptions,
  FindOptionsWhere,
  QueryDeepPartialEntity,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import {
  MutationResult,
  PaginateOptions,
  PaginateResult,
  RawPaginateOptions,
} from '@interfaces';

@Injectable()
export abstract class AbstractRepository<TEntity extends AbstractEntity> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly repository: Repository<TEntity>,
    protected readonly dataSource: DataSource,
  ) {}

  // CREATE
  async create(entity: DeepPartial<TEntity>): Promise<TEntity> {
    const created = this.repository.create(entity);
    return this.repository.save(created);
  }

  // CREATE MANY
  async createMany(entities: DeepPartial<TEntity>[]): Promise<TEntity[]> {
    const created = this.repository.create(entities);
    return this.repository.save(created);
  }

  // FIND ONE
  async findOne(
    where: FindOptionsWhere<TEntity>,
    options?: Pick<FindManyOptions<TEntity>, 'relations' | 'select' | 'order'>,
  ): Promise<TEntity | null> {
    return this.repository.findOne({ where, ...options });
  }

  // FIND ONE OR FAIL
  async findOneOrFail(
    where: FindOptionsWhere<TEntity>,
    options?: Pick<FindManyOptions<TEntity>, 'relations' | 'select'>,
  ): Promise<TEntity> {
    const entity = await this.findOne(where, options);
    if (!entity) {
      this.logger.warn(`Not found: ${JSON.stringify(where)}`);
      throw new NotFoundException(`${this.repository.metadata.name} not found`);
    }
    return entity;
  }

  // FIND
  async find(
    // where?: FindOptionsWhere<TEntity>,
    options?: FindManyOptions<TEntity>,
  ): Promise<TEntity[]> {
    return this.repository.find(options);
  }

  // UPDATE
  async updateOne(
    where: FindOptionsWhere<TEntity>,
    update: QueryDeepPartialEntity<TEntity>,
  ): Promise<number> {
    const result = await this.repository.update(where, update);
    return result.affected ?? 0;
  }

  // UPDATE ONE OR FAILs
  async updateOneOrFail(
    where: FindOptionsWhere<TEntity>,
    update: QueryDeepPartialEntity<TEntity>,
  ): Promise<TEntity> {
    const affected = await this.updateOne(where, update);
    if (!affected) {
      throw new NotFoundException(
        `${this.repository.metadata.name} not found to update`,
      );
    }
    return this.findOneOrFail(where);
  }

  // DELETE
  async softDelete(where: FindOptionsWhere<TEntity>): Promise<number> {
    const result = await this.repository.softDelete(where);
    return result.affected ?? 0;
  }

  // SOFT DELETE OR FAIL
  async softDeleteOrFail(
    where: FindOptionsWhere<TEntity>,
  ): Promise<MutationResult> {
    const affected = await this.softDelete(where);
    if (!affected) {
      this.logger.warn(`Not found to delete: ${JSON.stringify(where)}`);
      throw new NotFoundException(
        `${this.repository.metadata.name} not found to delete`,
      );
    }
    return { success: true, affected };
  }

  // HARD DELETE
  async hardDelete(where: FindOptionsWhere<TEntity>): Promise<number> {
    const result = await this.repository.delete(where);
    return result.affected ?? 0;
  }

  // HARD DELETE OR FAIL
  async hardDeleteOrFail(
    where: FindOptionsWhere<TEntity>,
  ): Promise<MutationResult> {
    const affected = await this.hardDelete(where);

    if (!affected) {
      this.logger.warn(`Not found to hard delete: ${JSON.stringify(where)}`);
      throw new NotFoundException(
        `${this.repository.metadata.name} not found to delete`,
      );
    }

    return { success: true, affected };
  }

  // RESTORE
  async restore(id: number): Promise<MutationResult> {
    const result = await this.repository.restore(id);
    if (!result.affected) {
      throw new NotFoundException(
        `${this.repository.metadata.name} not found or already active`,
      );
    }
    return { success: true, affected: result.affected };
  }

  // EXISTS
  async existsBy(where: FindOptionsWhere<TEntity>): Promise<boolean> {
    return this.repository.existsBy(where);
  }

  // COUNT
  async count(where: FindOptionsWhere<TEntity>): Promise<number> {
    return this.repository.count({ where });
  }

  // UPSERT
  async upsert(
    entity: DeepPartial<TEntity>,
    conflictPaths: string[],
  ): Promise<TEntity> {
    await this.repository.upsert(entity as any, {
      conflictPaths,
      skipUpdateIfNoValuesChanged: true,
    });
    return this.repository.findOne({
      where: conflictPaths.reduce(
        (acc, key) => ({ ...acc, [key]: (entity as any)[key] }),
        {},
      ) as FindOptionsWhere<TEntity>,
    }) as Promise<TEntity>;
  }

  // PAGINATE
  async paginate(options: {
    where?: FindOptionsWhere<TEntity>;
    page?: number;
    limit?: number;
    order?: FindManyOptions<TEntity>['order'];
    relations?: FindManyOptions<TEntity>['relations'];
  }): Promise<{ total: number; rows: TEntity[] }> {
    const { where = {}, page = 1, limit = 20, order, relations } = options;

    const [rows, total] = await this.repository.findAndCount({
      where,
      order,
      relations,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { total, rows };
  }

  // PAGINATE
  async paginate2(
    options: PaginateOptions<TEntity>,
  ): Promise<PaginateResult<TEntity>> {
    const {
      where = {},
      page = 1,
      limit = 20,
      order,
      relations,
      withDeleted = false,
    } = options;

    const [rows, total] = await this.repository.findAndCount({
      where,
      order,
      relations,
      withDeleted,
      skip: (page - 1) * limit,
      take: limit,
    });

    return this.buildPaginateResult(rows, total, page, limit);
  }

  buildPaginateResult<R>(
    rows: R[],
    total: number,
    page: number,
    limit: number,
  ): PaginateResult<R> {
    const totalPages = Math.ceil(total / limit);
    return {
      rows,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  // QUERY BUILDER
  qb(alias?: string): SelectQueryBuilder<TEntity> {
    const name = alias ?? this.repository.metadata.tableName;
    return this.repository.createQueryBuilder(name);
  }

  // RAW SQL
  async rawQuery<R = any>(
    sql: string,
    params: any[] = [],
    manager?: EntityManager,
  ): Promise<R[]> {
    try {
      const runner = manager ?? this.dataSource.manager;
      return await runner.query(sql, params);
    } catch (err) {
      this.logger.error(`Raw query failed: ${sql}`, err);
      throw new InternalServerErrorException('Database query failed');
    }
  }

  // RAW SQL PAGINATION
  async rawPaginate<R = any>(
    countSql: string,
    dataSql: string,
    options: RawPaginateOptions = {},
  ): Promise<PaginateResult<R>> {
    const { page = 1, limit = 20, params = [] } = options;
    const offset = (page - 1) * limit;

    const [countResult, rows] = await Promise.all([
      this.rawQuery<{ count: string }>(countSql, params),
      this.rawQuery<R>(
        `${dataSql} LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
        [...params, limit, offset],
      ),
    ]);

    const total = parseInt(countResult[0]?.count ?? '0', 10);
    return this.buildPaginateResult(rows, total, page, limit);
  }

  // QUERY VIEW
  async queryView<R = any>(
    viewName: string,
    conditions: string[] = [],
    params: any[] = [],
    orderBy?: string,
  ): Promise<R[]> {
    const where =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const order = orderBy ? `ORDER BY ${orderBy}` : '';
    return this.rawQuery<R>(
      `SELECT * FROM ${viewName} ${where} ${order}`,
      params,
    );
  }

  // CALL FUNCTION
  async callFunction<R = any>(
    fnName: string,
    params: any[] = [],
    manager?: EntityManager,
  ): Promise<R> {
    const placeholders = params.map((_, i) => `$${i + 1}`).join(', ');
    const [result] = await this.rawQuery<R>(
      `SELECT * FROM ${fnName}(${placeholders})`,
      params,
      manager,
    );
    return result;
  }

  // CALL FUNCTION MANY
  async callFunctionMany<R = any>(
    fnName: string,
    params: any[] = [],
    manager?: EntityManager,
  ): Promise<R[]> {
    const placeholders = params.map((_, i) => `$${i + 1}`).join(', ');
    return this.rawQuery<R>(
      `SELECT * FROM ${fnName}(${placeholders})`,
      params,
      manager,
    );
  }

  // CALL PROCEDURE
  async callProcedure(
    procName: string,
    params: any[] = [],
    manager?: EntityManager,
  ): Promise<void> {
    const placeholders = params.map((_, i) => `$${i + 1}`).join(', ');
    await this.rawQuery(`CALL ${procName}(${placeholders})`, params, manager);
  }

  // WITH TRANSACTION
  async withTransaction<R>(
    callback: (manager: EntityManager) => Promise<R>,
  ): Promise<R> {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await callback(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Transaction rolled back', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // WITH SAVEPOINT
  async withSavepoint<R>(
    manager: EntityManager,
    savepointName: string,
    callback: (manager: EntityManager) => Promise<R>,
  ): Promise<R> {
    await manager.query(`SAVEPOINT ${savepointName}`);
    try {
      const result = await callback(manager);
      await manager.query(`RELEASE SAVEPOINT ${savepointName}`);
      return result;
    } catch (err) {
      await manager.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
      throw err;
    }
  }

  // BULK INSERT
  async bulkInsert(
    entities: DeepPartial<TEntity>[],
    chunkSize = 500,
  ): Promise<void> {
    const table = this.repository.metadata.tableName;
    const columns = this.repository.metadata.columns
      .filter((c) => !c.isGenerated && !c.isCreateDate && !c.isUpdateDate)
      .map((c) => c.databaseName);

    for (let i = 0; i < entities.length; i += chunkSize) {
      const chunk = entities.slice(i, i + chunkSize);
      const values: any[] = [];
      const rows = chunk.map((entity) => {
        const placeholders = columns.map(() => {
          values.push((entity as any)[columns[values.length / columns.length]]);
          return `$${values.length}`;
        });
        return `(${placeholders.join(', ')})`;
      });

      await this.dataSource.query(
        `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${rows.join(
          ', ',
        )}`,
        values,
      );
    }
  }

  // BULK SOFT DELETE
  async bulkSoftDelete(ids: number[]): Promise<number> {
    if (!ids.length) return 0;
    const table = this.repository.metadata.tableName;
    const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
    const result = await this.dataSource.query(
      `UPDATE ${table} SET deleted_at = NOW()
       WHERE id IN (${placeholders}) AND deleted_at IS NULL`,
      ids,
    );
    return result.rowCount ?? 0;
  }
}
