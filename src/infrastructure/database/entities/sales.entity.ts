import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { UsersEntity } from './users.entity';
import { SALE_METHOD } from '@enums';
import { CustomersEntity } from './customers.entity';
import { SaleItemsEntity } from './sale-items.entity';

@Entity({ name: 'sales' })
@Index(['business_id'])
export class SalesEntity extends AbstractEntity {
  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  total_price: number;

  @Column({ type: 'int' })
  paid_amount: number;

  @Column({ type: 'int', default: 0 })
  debt_amount: number;

  @Column({ type: 'enum', enum: SALE_METHOD })
  sale_type: SALE_METHOD;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @Column({ type: 'int', nullable: true })
  customer_id: number;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => UsersEntity, (users) => users.sales, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => CustomersEntity, (customer) => customer.sales, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'customer_id' })
  customer: CustomersEntity;

  @ManyToOne(() => BusinessesEntity, (business) => business.sales, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToMany(() => SaleItemsEntity, (sale_items) => sale_items.sale)
  sale_items: SaleItemsEntity[];
}
