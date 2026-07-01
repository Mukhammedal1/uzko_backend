import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'admins' })
export class AdminsEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'int' })
  user_id: number;

  @ManyToOne(() => UsersEntity, (user) => user.admin, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
