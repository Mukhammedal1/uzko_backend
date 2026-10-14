import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  Unique,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { CurrencyEntity } from './currency.entity';

@Entity({ name: 'business_currency' })
@Unique(['business_id', 'currency_id'])
export class BusinessCurrencyEntity extends AbstractEntity {
  @Column({ type: 'int' })
  business_id: number;

  @Column({ type: 'int' })
  currency_id: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 2,
    default: 1,
  })
  rate: string;

  @Column({ type: 'boolean', default: false })
  is_main: boolean;

  @ManyToOne(() => BusinessesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @ManyToOne(() => CurrencyEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'currency_id' })
  currency: CurrencyEntity;
}
