import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { PurchasesEntity } from './purchases.entity';
import { ProductVariantsEntity } from './product-variants.entity';
import { StocksEntity } from './stocks.entity';
import { ShelfNumbersEntity } from './shelf_number.entity';
import { CurrencyEntity } from './currency.entity';

@Entity({ name: 'purchase_items' })
@Index(['purchase_id'])
// @Index(['product_id'])
// @Index(['purchase_id', 'product_id'])
export class PurchaseItemsEntity extends AbstractEntity {
  @Column({ type: 'int' })
  purchase_id: number;

  @Column({ type: 'int' })
  product_variant_id: number;

  @Column({ type: 'int' })
  stock_id: number;

  @Column({ type: 'int' })
  shelf_number_id: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  quantity: string;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  purchase_price: string;

  @Column({ type: 'int' })
  purchase_price_currency_id: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  retail_price: string;

  @Column({ type: 'int' })
  retail_price_currency_id: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  retail_price_percentage: number;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  wholesale_price: string;

  @Column({ type: 'int', nullable: true })
  wholesale_price_currency_id: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  wholesale_price_percentage: number;

  @Column({ type: 'int' })
  total_price: number;

  @ManyToOne(() => ProductVariantsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_variant_id' })
  variant: ProductVariantsEntity;

  @ManyToOne(() => StocksEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_id' })
  stock: StocksEntity;

  @ManyToOne(() => ShelfNumbersEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'shelf_number_id' })
  shelf_number: ShelfNumbersEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'purchase_price_currency_id' })
  purchase_price_currency: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'retail_price_currency_id' })
  retail_price_currency: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'wholesale_price_currency_id' })
  wholesale_price_currency: CurrencyEntity;

  @ManyToOne(() => PurchasesEntity, (purchase) => purchase.purchase_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchasesEntity;
}
