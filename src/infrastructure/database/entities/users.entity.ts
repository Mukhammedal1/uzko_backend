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
import { SalesEntity } from './sales.entity';
import { PurchasesEntity } from './purchases.entity';
import { UserPermissionsEntity } from './user-permissions.entity';
import { USER_TYPE } from '@enums';

@Entity({ name: 'users' })
@Index(['business_id'])
export class UsersEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', unique: true })
  phone_number: string;

  @Column({ type: 'varchar', length: 1000 })
  hashed_password: string;

  @Column({ type: 'enum', enum: USER_TYPE })
  user_type: USER_TYPE;

  @Column({ type: 'int' })
  business_id: number;

  @ManyToOne(() => BusinessesEntity, (business) => business.users, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'business_id' })
  business: BusinessesEntity;

  @OneToMany(() => SalesEntity, (sale) => sale.user)
  sales: SalesEntity[];

  @OneToMany(() => PurchasesEntity, (purchase) => purchase.user)
  purchases: PurchasesEntity[];

  @OneToMany(
    () => UserPermissionsEntity,
    (user_permission) => user_permission.user,
  )
  user_permissions: UserPermissionsEntity[];
}
