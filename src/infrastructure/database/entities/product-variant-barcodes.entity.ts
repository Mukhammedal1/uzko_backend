import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ProductVariantsEntity } from './product-variants.entity';
import { BusinessesEntity } from './businesses.entity';

@Entity({ name: 'product_variant_barcodes' })
@Unique(['business_id', 'barcode'])
@Index(['barcode'])
@Index(['product_variant_id'])
export class ProductVariantBarcodesEntity extends AbstractEntity {
  @Column({ type: 'int' })
  product_variant_id: number;

  @Column({ type: 'int' })
  business_id: number;

  @Column({ type: 'varchar' })
  barcode: string;

  @ManyToOne(() => ProductVariantsEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_variant_id' })
  product_variant: ProductVariantsEntity;

  @ManyToOne(() => BusinessesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;
}
