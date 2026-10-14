import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
// import { PurchasesController } from './purchases.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PurchaseItemsEntity, PurchasesEntity } from '@database';
import { PurchaseItemsRepository, PurchasesRepository } from './repositories';

@Module({
  imports: [TypeOrmModule.forFeature([PurchasesEntity, PurchaseItemsEntity])],
  controllers: [],
  providers: [PurchasesService, PurchasesRepository, PurchaseItemsRepository],
  exports: [PurchasesService],
})
export class PurchasesModule {}
