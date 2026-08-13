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
import { ShelfNumbersEntity } from './shelf_number.entity';
import { ProductBarcodesEntity } from './product-barcodes.entity';
import { CurrencyEntity } from './currency.entity';

@Entity({ name: 'products' })
@Index(['business_id'])
export class ProductsEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'boolean', default: false })
  allow_below_cost_sale: boolean;

  @Column({ type: 'int' })
  purchase_price: number;

  @Column({ type: 'int' })
  purchase_price_currency_id: number;

  @Column({ type: 'int' })
  retail_price: number;

  @Column({ type: 'int' })
  retail_price_currency_id: number;

  @Column({ type: 'int', nullable: true })
  retail_price_percentage: number;

  @Column({ type: 'int', nullable: true })
  wholesale_price: number;

  @Column({ type: 'int' })
  wholesale_price_currency_id: number;

  @Column({ type: 'int', nullable: true })
  wholesale_price_percentage: number;

  @Column({ type: 'int', nullable: true })
  unit_id: number;

  @Column({ type: 'int', nullable: true })
  stock_id: number;

  @Column({ type: 'int', nullable: true })
  shelf_number_id: number;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'purchase_price_currency_id' })
  purchase_price_currency: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'retail_price_currency_id' })
  retail_price_currency: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'wholesale_price_currency_id' })
  wholesale_price_currency: CurrencyEntity;

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

  @OneToMany(() => ProductBarcodesEntity, (barcodes) => barcodes.product)
  barcodes: ProductBarcodesEntity[];

  @ManyToOne(() => ShelfNumbersEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'shelf_number_id' })
  shelf_number: ShelfNumbersEntity;
}
