import { Column, Entity, Index } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';

@Entity({ name: 'otp' })
@Index(['expires_at'])
@Index(['email', 'code'])
export class OtpEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'int', default: 0 })
  attempt: number;

  @Column({ type: 'timestamptz' })
  expires_at: Date;
}
