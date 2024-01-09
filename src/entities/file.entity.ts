import { Letter } from 'src/entities/letter.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Letter, (letter) => letter.photo_url)
  letter_id: number;

  @Column()
  photo_url: string;

  @Column()
  type: string; // stamp, photo, media 등
}
