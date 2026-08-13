import { Module } from '@nestjs/common';
import { ShelfNumbersService } from './shelf_numbers.service';
import { ShelfNumbersController } from './shelf_numbers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShelfNumbersEntity } from '@database';
import { BusinessesModule } from 'modules/businesses';
import { ShelfNumbersRepository } from './shelf_numbers.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ShelfNumbersEntity]), BusinessesModule],
  controllers: [ShelfNumbersController],
  providers: [ShelfNumbersService, ShelfNumbersRepository],
  exports: [ShelfNumbersService],
})
export class ShelfNumbersModule {}
