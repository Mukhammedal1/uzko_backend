import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Index()
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz', nullable: true })
  @Index()
  deleted_at: Date;
}
