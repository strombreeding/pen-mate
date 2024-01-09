import { Languages } from 'src/types/user';
import { User } from 'src/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User, (user) => user.language)
  user_id: number;

  @Column()
  language: Languages;

  @Column()
  level: number;
}
