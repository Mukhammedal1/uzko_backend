import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { UnitsEntity } from './units.entity';
import { ProductVariantsEntity } from './product-variants.entity';

@Entity({ name: 'products' })
export class ProductsEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'int' })
  business_id: number;

  @Column({ type: 'int' })
  unit_id: number;

  @ManyToOne(() => BusinessesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @ManyToOne(() => UnitsEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'unit_id' })
  unit: UnitsEntity;

  @OneToMany(() => ProductVariantsEntity, (variant) => variant.product)
  variants: ProductVariantsEntity[];
}
