import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';
import { SalesEntity } from './sales.entity';
import { PurchasesEntity } from './purchases.entity';
import { UserPermissionsEntity } from './user-permissions.entity';
import { USER_TYPE } from '@enums';
import { AdminsEntity } from './admin.entity';
import { BusinessEmployeesEntity } from './business-employees.entity';

@Entity({ name: 'users' })
@Index(['business_id'])
export class UsersEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

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

  @OneToOne(() => AdminsEntity, (admin) => admin.user)
  admin: AdminsEntity;

  @OneToOne(
    () => BusinessEmployeesEntity,
    (business_employee) => business_employee.user,
  )
  business_employee: BusinessEmployeesEntity;

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
