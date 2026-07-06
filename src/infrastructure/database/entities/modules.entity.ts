import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { PagesEntity } from './pages.entity';
import { NameDto } from '../dtos';
import { FilesEntity } from './files.entity';

@Entity({ name: 'modules' })
export class ModulesEntity extends AbstractEntity {
  @Column({ type: 'jsonb', unique: true })
  name: NameDto;

  @Column({ type: 'varchar', unique: true })
  key: string;

  @Column({ type: 'int', unique: true })
  icon_file_id: number;

  @OneToMany(() => PagesEntity, (page) => page.module)
  pages: PagesEntity[];

  @OneToOne(() => FilesEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'icon_file_id' })
  icon: FilesEntity;
}
