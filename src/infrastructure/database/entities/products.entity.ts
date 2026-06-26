import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { UnitsEntity } from './units.entity';
import { StocksEntity } from './stocks.entity';
import { SaleItemsEntity } from './sale-items.entity';
import { PurchaseItemsEntity } from './purchase-items.entity';

@Entity({ name: 'products' })
@Index(['business_id'])
export class ProductsEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'int' })
  purchase_price: number;

  @Column({ type: 'int' })
  sale_price: number;

  @Column({ type: 'varchar' })
  barcode: string;

  @Column({ type: 'int' })
  unit_id: number;

  @Column({ type: 'int' })
  stock_id: number;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => UnitsEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'unit_id' })
  unit: UnitsEntity;

  @ManyToOne(() => StocksEntity, (stock) => stock.products, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'stock_id' })
  stock: StocksEntity;

  @ManyToOne(() => BusinessesEntity, (business) => business.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToMany(() => SaleItemsEntity, (sale_items) => sale_items.product)
  sale_items: SaleItemsEntity[];

  @OneToMany(
    () => PurchaseItemsEntity,
    (purchase_items) => purchase_items.product,
  )
  purchase_items: PurchaseItemsEntity[];
}
