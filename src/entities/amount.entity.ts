import { User } from 'src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Amount {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.payment_amount)
  user_id: number;

  @Column()
  cnt: number;

  @Column()
  kind: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
