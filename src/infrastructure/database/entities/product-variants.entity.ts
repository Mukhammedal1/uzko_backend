import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  Unique,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { StocksEntity } from './stocks.entity';
import { ShelfNumbersEntity } from './shelf_number.entity';
import { CurrencyEntity } from './currency.entity';
import { FilesEntity } from './files.entity';
import { ProductsEntity } from './products.entity';
import { ProductVariantBarcodesEntity } from './product-variant-barcodes.entity';
import { SuppliersEntity } from './suppliers.entity';

@Entity({ name: 'product_variants' })
@Unique(['product_id', 'artikul'])
@Index(['product_id'])
@Index(['artikul'])
export class ProductVariantsEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ type: 'boolean', default: false })
  allow_below_cost_sale: boolean;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
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

  @Column({ type: 'int', nullable: true })
  stock_id: number;

  @Column({ type: 'int', nullable: true })
  shelf_number_id: number;

  @Column({ type: 'int', nullable: true })
  supplier_id: number;

  @Column({ type: 'varchar' })
  artikul: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 3,
    nullable: true,
    default: 0,
  })
  alert_quantity: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 3, nullable: true })
  box_quantity: string | null;

  @Column({ type: 'int', nullable: true })
  file_id: number;

  @Column({ type: 'int' })
  product_id: number;

  @ManyToOne(() => ProductsEntity, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductsEntity;

  @ManyToOne(() => SuppliersEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'supplier_id' })
  supplier: SuppliersEntity;

  @OneToOne(() => FilesEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'file_id' })
  image: FilesEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'purchase_price_currency_id' })
  purchase_price_currency: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'retail_price_currency_id' })
  retail_price_currency: CurrencyEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'wholesale_price_currency_id' })
  wholesale_price_currency: CurrencyEntity;

  @ManyToOne(() => StocksEntity, (stock) => stock.product_variants, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'stock_id' })
  stock: StocksEntity;

  @OneToMany(
    () => ProductVariantBarcodesEntity,
    (barcodes) => barcodes.product_variant,
  )
  barcodes: ProductVariantBarcodesEntity[];

  @ManyToOne(() => ShelfNumbersEntity, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'shelf_number_id' })
  shelf_number: ShelfNumbersEntity;
}
