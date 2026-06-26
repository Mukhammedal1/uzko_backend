import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { UsersEntity } from './users.entity';
import { PagesEntity } from './pages.entity';

@Entity({ name: 'user_permissions' })
@Unique(['user_id', 'page_id'])
export class UserPermissionsEntity extends AbstractEntity {
  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'int' })
  page_id: number;

  @ManyToOne(() => UsersEntity, (user) => user.user_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;

  @ManyToOne(() => PagesEntity, (page) => page.user_permissions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'page_id' })
  permission: PagesEntity;
}
