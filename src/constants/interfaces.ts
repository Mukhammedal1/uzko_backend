export declare interface AppConfig {
  port: number;
  production: boolean;
  passpwordHashKey: string;
  jwtAccessSecretKey: string;
  jwtRefreshSecretKey: string;
  jwtAccessExpires: string;
  jwtRefreshExpires: string;
}

export declare interface SmsConfig {
  SMS_LOGIN: string;
  SMS_PASSWORD: string;
  SMS_URL: string;
}

export declare interface DatabaseConfig {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  NODE_ENV: string;
}

import { FindManyOptions, FindOptionsWhere } from 'typeorm';

export interface PaginateResult<T> {
  rows: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginateOptions<TEntity> {
  where?: FindOptionsWhere<TEntity>;
  page?: number;
  limit?: number;
  order?: FindManyOptions<TEntity>['order'];
  relations?: FindManyOptions<TEntity>['relations'];
  withDeleted?: boolean;
}

export interface RawPaginateOptions {
  page?: number;
  limit?: number;
  params?: any[];
}

export interface MutationResult {
  success: boolean;
  affected: number;
}
