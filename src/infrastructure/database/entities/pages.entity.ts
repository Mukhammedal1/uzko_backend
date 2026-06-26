import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { ModulesEntity } from './modules.entity';
import { UserPermissionsEntity } from './user-permissions.entity';
import { NameDto } from '../dtos';

@Entity({ name: 'pages' })
@Unique(['module_id', 'key'])
export class PagesEntity extends AbstractEntity {
  @Column({ type: 'jsonb', unique: true })
  name: NameDto;

  @Column({ type: 'varchar' })
  key: string;

  @Column({ type: 'int' })
  module_id: number;

  @ManyToOne(() => ModulesEntity, (module) => module.pages, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'module_id' })
  module: ModulesEntity;

  @OneToMany(
    () => UserPermissionsEntity,
    (user_permission) => user_permission.permission,
  )
  user_permissions: UserPermissionsEntity[];
}
