import { Column, Entity, Index, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ProductsEntity } from './products.entity';

@Entity({ name: 'product_barcodes' })
@Index(['code'])
export class ProductBarcodesEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'int' })
  product_id: number;

  @ManyToOne(() => ProductsEntity, { onDelete: 'CASCADE' })
  product: ProductsEntity;
}
