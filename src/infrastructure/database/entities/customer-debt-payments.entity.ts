import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { CustomersEntity } from './customers.entity';

@Entity({ name: 'customer_debt_payments' })
@Index(['customer_id'])
@Index(['business_id'])
@Index(['customer_id', 'business_id'])
export class CustomerDebtPaymentsEntity extends AbstractEntity {
  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'int' })
  customer_id: number;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => CustomersEntity, (customer) => customer.debts)
  @JoinColumn({ name: 'customer_id' })
  customer: CustomersEntity;

  @ManyToOne(() => BusinessesEntity, (business) => business.customer_debts)
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;
}
