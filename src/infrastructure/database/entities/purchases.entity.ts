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
import { UsersEntity } from './users.entity';
import { SALE_METHOD } from '@enums';
import { SuppliersEntity } from './suppliers.entity';
import { PurchaseItemsEntity } from './purchase-items.entity';

@Entity({ name: 'purchases' })
@Index(['business_id'])
export class PurchasesEntity extends AbstractEntity {
  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int', nullable: true })
  supplier_id: number;

  @Column({ type: 'int' })
  total_price: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  paid_amount: string;

  @Column({ type: 'enum', enum: SALE_METHOD })
  purchase_type: SALE_METHOD;

  @Column({ type: 'varchar', nullable: true })
  note: string;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => UsersEntity, (users) => users.purchases, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => SuppliersEntity, (supplier) => supplier.purchases, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'supplier_id' })
  supplier: SuppliersEntity;

  @ManyToOne(() => BusinessesEntity, (business) => business.purchases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToMany(
    () => PurchaseItemsEntity,
    (purchase_items) => purchase_items.purchase,
  )
  purchase_items: PurchaseItemsEntity[];
}
