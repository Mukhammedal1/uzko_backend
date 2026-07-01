import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'business_employees' })
@Index(['business_id'])
export class BusinessEmployeesEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar', nullable: true })
  last_name: string;

  @Column({ type: 'int' })
  business_id: number;

  @Column({ type: 'int', nullable: true })
  user_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToOne(() => UsersEntity, (user) => user.business_employee, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
