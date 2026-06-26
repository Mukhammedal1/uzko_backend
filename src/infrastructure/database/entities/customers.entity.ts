import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { SalesEntity } from './sales.entity';
import { BusinessesEntity } from './businesses.entity';
import { CustomerDebtsEntity } from './customer-debts.entity';

@Entity({ name: 'customers' })
@Index(['business_id'])
export class CustomersEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'int', default: 0 })
  debt_amount: number;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.customers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToMany(() => SalesEntity, (sales) => sales.customer)
  sales: SalesEntity[];

  @OneToMany(
    () => CustomerDebtsEntity,
    (customer_debt) => customer_debt.customer,
  )
  debts: CustomerDebtsEntity[];
}
