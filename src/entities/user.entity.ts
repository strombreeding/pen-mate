import { Amount } from 'src/entities/amount.entity';
import { Ignore } from 'src/entities/ignore.entity';
import { Language } from 'src/entities/language.entity';
import { Notification } from 'src/entities/notification.entity';
import { Wallet } from 'src/entities/wallet.entity';
import { MBTI } from 'src/types/user';

import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RedDot } from './redDot.entity';
import { Letter } from './letter.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  email: string;

  @Column({ nullable: true })
  passward?: string;

  @Column()
  access_token: string;

  @Column()
  refresh_token: string;

  @Column()
  interest: string; // 관심사

  @Column()
  mbti: MBTI;

  @Column()
  nation: string; // 국가

  @Column()
  latitude: number; // 위도

  @Column()
  longitude: number; // 경도

  @Column()
  ban: Date;

  @Column()
  social: 'google' | 'kakao' | 'apple' | 'none';

  @OneToMany((type) => RedDot, (redDot) => redDot.user_id)
  red_dot: RedDot[];

  @OneToMany((type) => Language, (language) => language.user_id)
  language: Language[];

  @OneToMany((type) => Notification, (notification) => notification.user_id)
  notification: Notification[];

  @OneToMany((type) => Amount, (amount) => amount.user_id)
  payment_amount: Amount[];

  @OneToMany((type) => Ignore, (ignore) => ignore.self)
  ignore: Ignore[];

  @OneToOne((type) => Wallet, (wallet) => wallet.user_id)
  wallet: Wallet;

  @OneToMany((type) => Letter, (letter) => letter.user_id)
  letter: Letter[];

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;
}
