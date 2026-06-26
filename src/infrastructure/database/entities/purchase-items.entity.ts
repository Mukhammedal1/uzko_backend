import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ProductsEntity } from './products.entity';
import { PurchasesEntity } from './purchases.entity';

@Entity({ name: 'purchase_items' })
@Index(['purchase_id'])
@Index(['product_id'])
@Index(['purchase_id', 'product_id'])
export class PurchaseItemsEntity extends AbstractEntity {
  @Column({ type: 'int' })
  purchase_id: number;

  @Column({ type: 'int' })
  product_id: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int' })
  price: number;

  @Column({ type: 'int' })
  total_price: number;

  @ManyToOne(() => PurchasesEntity, (purchase) => purchase.purchase_items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_id' })
  purchase: PurchasesEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.purchase_items, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'product_id' })
  product: ProductsEntity;
}
