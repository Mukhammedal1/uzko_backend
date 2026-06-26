import { dbConfig } from '@configs';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        type: 'postgres',
        host: dbConfig.DB_HOST,
        port: dbConfig.DB_PORT,
        username: dbConfig.DB_USER,
        password: dbConfig.DB_PASSWORD,
        database: dbConfig.DB_NAME,
        entities,
        // synchronize: process.env.NODE_ENV !== 'production',
        synchronize: true,
        autoLoadEntities: true,
        migrationsRun: process.env.NODE_ENV !== 'production',
        // migrations: [join(__dirname, 'migrations/*.{ts,js}')],

        // Pool configuration
        extra: {
          max: 40,
          min: 4,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 3000,
          statement_timeout: 10000,
        },

        // Logging configuration
        logging:
          dbConfig.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
        logger: 'advanced-console',
      }),
    }),
  ],
})
export class DatabaseModule {}
