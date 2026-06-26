import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { PurchasesEntity } from './purchases.entity';

@Entity({ name: 'suppliers' })
@Index(['business_id'])
export class SuppliersEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'varchar', nullable: true })
  address: string;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.suppliers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToMany(() => PurchasesEntity, (purchase) => purchase.supplier)
  purchases: PurchasesEntity[];
}
