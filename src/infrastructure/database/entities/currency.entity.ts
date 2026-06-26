import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';

@Entity({ name: 'currency' })
@Index(['business_id'])
export class CurrencyEntity extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true })
  name?: string;

  @Column({ type: 'varchar', unique: true })
  short_name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  symbol: string;

  @Column({ type: 'int' })
  rate: number;

  @Column({ type: 'boolean', default: false })
  is_main: boolean;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.currency, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;
}
