import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameDocument = HydratedDocument<Game>;

@Schema()
export class Game {
  @Prop({ required: true, unique: true })
  game_title: string;

  @Prop()
  description: string;

  @Prop()
  min_cost: number;

  @Prop()
  match_type: number;

  @Prop()
  play_type: string;

  @Prop()
  hint: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);
