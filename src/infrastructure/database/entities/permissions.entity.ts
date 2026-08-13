import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { PagesEntity } from './pages.entity';
import { ModulesEntity } from './modules.entity';
import { PERMISSION_TYPE } from '@enums';

@Entity({ name: 'permissions' })
export class PermissionsEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column({ type: 'int' })
  module_id: number;

  @Column({ type: 'int', nullable: true })
  page_id: number;

  @Column({
    type: 'enum',
    enum: PERMISSION_TYPE,
    default: PERMISSION_TYPE.BUSINESS,
  })
  permission_type: PERMISSION_TYPE;

  @ManyToOne(() => ModulesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'module_id' })
  module: ModulesEntity;

  @ManyToOne(() => PagesEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'page_id' })
  page: PagesEntity;
}
