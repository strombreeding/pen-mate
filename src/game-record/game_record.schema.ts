import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GameRecordDocument = HydratedDocument<GameRecord>;

@Schema()
export class GameRecord {
  @Prop({ required: true, unique: true })
  player_id: string;

  @Prop()
  game_id: string;

  @Prop()
  cost: number;

  @Prop()
  reward: number;

  @Prop()
  get_point: number;

  @Prop()
  reward_items: string[];

  @Prop()
  play_time: number;

  @Prop()
  game_result: string;

  @Prop()
  game_special_option: string; // 뱅의 경우 자비, 고철장은 길드용 고철장인지, 여튼 보너스 주냐안주냐

  @Prop({ default: new Date() })
  play_at: Date;
}

export const GameRecordSchema = SchemaFactory.createForClass(GameRecord);
