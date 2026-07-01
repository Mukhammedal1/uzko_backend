import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { AbstractEntity } from '../abstract.entity';
import { UsersEntity } from './users.entity';

@Entity({ name: 'refresh_tokens' })
@Index(['user_id'])
export class RefreshTokensEntity extends AbstractEntity {
  @Column({ type: 'int' })
  user_id: number;

  @Column({ type: 'varchar', length: 10000 })
  hashed_token: string;

  @Column({ type: 'timestamptz' })
  expires_at: Date;

  @Column({ type: 'boolean', default: false })
  revoked: boolean;

  @ManyToOne(() => UsersEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsersEntity;
}
