import { User } from 'src/entities/user.entity';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne((type) => User, (user) => user.wallet)
  user_id: number;

  @Column({ default: 0 })
  moi: number;

  @Column({ default: 0 })
  second_gold: number;
}
