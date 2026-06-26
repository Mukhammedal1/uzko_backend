import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { SalesEntity } from './sales.entity';
import { ProductsEntity } from './products.entity';

@Entity({ name: 'sale_items' })
export class SaleItemsEntity extends AbstractEntity {
  @Column({ type: 'int' })
  sale_id: number;

  @Column({ type: 'int' })
  product_id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  total_price: number;

  @ManyToOne(() => SalesEntity, (sales) => sales.sale_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sale_id' })
  sale: SalesEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.sale_items, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductsEntity;
}
