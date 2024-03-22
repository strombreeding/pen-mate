import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Item } from 'src/item/item.schema';
import { CostObjProps } from 'src/types/record';

export type GameRecordDocument = HydratedDocument<GameRecord>;

@Schema()
export class GameRecord {
  @Prop()
  player_id: string;

  @Prop()
  game_title: string;

  @Prop([{ type: Types.ObjectId, ref: Item.name, default: [] }])
  rewards: Item[]; // Item id들

  @Prop({ default: 0 })
  play_time: number;

  @Prop()
  cost_obj: CostObjProps[];

  @Prop({ default: '' })
  game_result: string;

  @Prop({ default: '' })
  game_special_option: string; // 뱅의 경우 자비, 고철장은 길드용 고철장인지, 여튼 보너스 주냐안주냐

  @Prop({ default: new Date() })
  play_at: Date;
}

export const GameRecordSchema = SchemaFactory.createForClass(GameRecord);
