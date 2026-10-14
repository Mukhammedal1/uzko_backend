import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ProductsEntity,
  ProductVariantBarcodesEntity,
  ProductVariantsEntity,
} from '@database';
import {
  ProductsRepository,
  ProductVariantBarcodesRepository,
  ProductVariantsRepository,
} from './repositories';
import { UnitsModule } from 'modules/units';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductsEntity,
      ProductVariantsEntity,
      ProductVariantBarcodesEntity,
    ]),UnitsModule
  ],
  controllers: [ProductsController],
  providers: [
    ProductsService,
    ProductsRepository,
    ProductVariantsRepository,
    ProductVariantBarcodesRepository,
  ],
  exports: [ProductsService],
})
export class ProductsModule {}
