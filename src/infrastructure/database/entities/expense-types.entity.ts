import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { ExpensesEntity } from './expenses.entity';

@Entity({ name: 'expense_types' })
@Index(['business_id'])
export class ExpenseTypesEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  key: string;

  @Column({ type: 'boolean', default: false })
  is_system: boolean;

  @Column({ type: 'int', nullable: true })
  business_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.expense_types)
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToMany(() => ExpensesEntity, (expenses) => expenses.expense_type)
  expenses: ExpensesEntity[];
}
