import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { ProductVariantsEntity } from './product-variants.entity';

@Entity({ name: 'stocks' })
@Unique(['business_id', 'name'])
export class StocksEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.stocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToMany(
    () => ProductVariantsEntity,
    (product_variant) => product_variant.stock,
  )
  product_variants: ProductVariantsEntity[];
}
