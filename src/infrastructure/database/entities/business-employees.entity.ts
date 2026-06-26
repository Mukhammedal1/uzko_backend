import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';

@Entity({ name: 'business_employees' })
@Index(['business_id'])
export class BusinessOwnersEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;
}
