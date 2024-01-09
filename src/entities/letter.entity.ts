import { Language, Languages } from 'src/types/user';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { File } from './file.entity';
import { User } from './user.entity';

@Entity()
export class Letter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  content: string;

  @Column()
  language: Languages;

  @Column()
  send_date: Date;

  @Column()
  read_date: Date;

  @Column()
  public: boolean;

  @Column({ default: false })
  read: boolean;

  @Column({ nullable: true })
  interest: string;

  @OneToMany((type) => File, (file) => file.letter_id)
  photo_url: File[];

  @ManyToOne((type) => User, (user) => user.letter)
  user_id: number;
}
