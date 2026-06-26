import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { BusinessesEntity } from './businesses.entity';

@Entity({ name: 'agents' })
@Index(['agent_code'])
export class AgentsEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  agent_code: string;

  @Column({ type: 'varchar' })
  agent_name: string;

  @OneToMany(() => BusinessesEntity, (businesses) => businesses.agent)
  businesses: BusinessesEntity[];
}
