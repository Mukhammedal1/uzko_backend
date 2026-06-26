import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

@Entity({ name: 'otp' })
@Index(['phone_number'])
@Index(['expire_date'])
@Index(['phone_number', 'code'])
export class OtpEntity extends AbstractEntity {
  @Column({ type: 'int' })
  code: number;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'int', default: 0 })
  attempt: number;

  @Column({ type: 'timestamptz' })
  expire_date: Date;
}
