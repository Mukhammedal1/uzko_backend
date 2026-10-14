import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

@Entity({ name: 'units' })
export class UnitsEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  key: string;
}
