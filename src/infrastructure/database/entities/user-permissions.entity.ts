import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { UsersEntity } from './users.entity';
import { PermissionsEntity } from './permissions.entity';

@Entity({ name: 'user_permissions' })
@Unique(['user_id', 'permission_id'])
export class UserPermissionsEntity extends AbstractEntity {
  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  permission_id: number;

  @ManyToOne(() => UsersEntity, (user) => user.user_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => PermissionsEntity, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionsEntity;
}
