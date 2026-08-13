import { Module } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { SuppliersController } from './suppliers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusinessesModule } from 'modules/businesses';
import { SuppliersRepository } from './suppliers.repository';
import { SuppliersEntity } from '@database';

@Module({
  imports: [TypeOrmModule.forFeature([SuppliersEntity]), BusinessesModule],
  controllers: [SuppliersController],
  providers: [SuppliersService, SuppliersRepository],
  exports: [SuppliersService],
})
export class SuppliersModule {}
