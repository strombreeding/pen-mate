import { RedDotProps } from 'src/types/redDot';
import { User } from 'src/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RedDot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.red_dot)
  user_id: number;

  @Column()
  type: RedDotProps;

  @Column({ default: false })
  looked: boolean;
}
