import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

@Entity({ name: 'currency' })
export class CurrencyEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: true })
  symbol: string;
}
