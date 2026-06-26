import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { ExpenseTypesEntity } from './expense-types.entity';
import { SuppliersEntity } from './suppliers.entity';

@Entity({ name: 'expenses' })
@Index(['expense_type_id'])
@Index(['supplier_id'])
@Index(['business_id'])
@Index(['expense_type_id', 'supplier_id', 'business_id'])
export class ExpensesEntity extends AbstractEntity {
  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @Column({ type: 'int' })
  expense_type_id: number;

  @Column({ type: 'int' })
  supplier_id: number;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => ExpenseTypesEntity, (expense_type) => expense_type.expenses)
  @JoinColumn({ name: 'expense_type_id' })
  expense_type: ExpenseTypesEntity;

  @ManyToOne(() => SuppliersEntity)
  @JoinColumn({ name: 'supplier_id' })
  supplier: SuppliersEntity;

  @ManyToOne(() => BusinessesEntity, (business) => business.expense_types)
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;
}
