import { User } from 'src/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.notification)
  user_id: number;

  @Column()
  reason: string;

  @Column()
  from_page: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
}
