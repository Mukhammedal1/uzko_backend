import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';

@Entity({ name: 'units' })
@Index(['business_id'])
export class UnitsEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  short_name: string;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.units, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;
}
