import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { CUSTOMER_DEBTS_STATUS } from '@enums';
import { CustomersEntity } from './customers.entity';
import { SalesEntity } from './sales.entity';

@Entity({ name: 'customer_debts' })
@Index(['customer_id'])
@Index(['sale_id'])
@Index(['business_id'])
@Index(['customer_id', 'sale_id', 'business_id'])
export class CustomerDebtsEntity extends AbstractEntity {
  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @Column({
    type: 'enum',
    enum: CUSTOMER_DEBTS_STATUS,
    default: CUSTOMER_DEBTS_STATUS.UNPAID,
  })
  status: CUSTOMER_DEBTS_STATUS;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'int' })
  sale_id: number;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => CustomersEntity, (customer) => customer.debts)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomersEntity;

  @OneToOne(() => SalesEntity)
  @JoinColumn({ name: 'sale_id' })
  sale: SalesEntity;

  @ManyToOne(() => BusinessesEntity, (business) => business.customer_debts)
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;
}
