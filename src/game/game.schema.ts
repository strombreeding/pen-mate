import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { GameCost } from 'src/types/games';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  @Prop()
  game_url: string;

  @Prop({ required: true, unique: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  cost_obj: GameCost[];

  @Prop()
  rewards: string[];

  @Prop()
  match_type: number;

  @Prop()
  play_type: string;

  @Prop()
  hint: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
