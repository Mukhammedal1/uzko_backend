import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { ProductsEntity } from './products.entity';

@Entity({ name: 'stocks' })
@Index(['business_id'])
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

  @OneToMany(() => ProductsEntity, (product) => product.stock)
  products: ProductsEntity[];
}
