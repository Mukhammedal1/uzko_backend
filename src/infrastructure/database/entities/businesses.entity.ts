import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { UnitsEntity } from './units.entity';
import { UsersEntity } from './users.entity';
import { StocksEntity } from './stocks.entity';
import { SalesEntity } from './sales.entity';
import { CustomersEntity } from './customers.entity';
import { SuppliersEntity } from './suppliers.entity';
import { PurchasesEntity } from './purchases.entity';
import { ExpenseTypesEntity } from './expense-types.entity';
import { CustomerDebtsEntity } from './customer-debts.entity';
import { AgentsEntity } from './agents.entity';
import { ShelfNumbersEntity } from './shelf_number.entity';

@Entity({ name: 'businesses' })
@Index(['is_active'])
@Index(['agent_id'])
export class BusinessesEntity extends AbstractEntity {
  @Column({ type: 'int' })
  agent_id: number;

  @Column({ type: 'varchar' })
  company_name: string;

  @Column({ type: 'varchar', nullable: true })
  address?: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @ManyToOne(() => AgentsEntity, (agent) => agent.businesses, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'agent_id' })
  agent: AgentsEntity;

  @OneToMany(() => UsersEntity, (users) => users.business)
  users: UsersEntity[];

  @OneToMany(() => StocksEntity, (stocks) => stocks.business)
  stocks: StocksEntity[];

  @OneToMany(() => SalesEntity, (sales) => sales.business)
  sales: SalesEntity[];

  @OneToMany(() => PurchasesEntity, (purchase) => purchase.business)
  purchases: PurchasesEntity[];

  @OneToMany(() => CustomersEntity, (customers) => customers.business)
  customers: CustomersEntity[];

  @OneToMany(() => SuppliersEntity, (suppliers) => suppliers.business)
  suppliers: SuppliersEntity[];

  @OneToMany(() => ExpenseTypesEntity, (suppliers) => suppliers.business)
  expense_types: SuppliersEntity[];

  @OneToMany(
    () => CustomerDebtsEntity,
    (customer_debt) => customer_debt.business,
  )
  customer_debts: CustomerDebtsEntity[];

  @OneToMany(
    () => ShelfNumbersEntity,
    (shelf_numbers) => shelf_numbers.business,
  )
  shelf_numbers: ShelfNumbersEntity[];
}
