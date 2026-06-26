import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { PagesEntity } from './pages.entity';
import { NameDto } from '../dtos';

@Entity({ name: 'modules' })
export class ModulesEntity extends AbstractEntity {
  @Column({ type: 'jsonb', unique: true })
  name: NameDto;

  @Column({ type: 'varchar', unique: true })
  key: string;

  @OneToMany(() => PagesEntity, (page) => page.module)
  pages: PagesEntity[];
}
