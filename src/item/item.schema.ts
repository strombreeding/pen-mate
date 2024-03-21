import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({ required: true })
  owner_id: string;

  @Prop()
  cost: number; // 방어력+ 1 등등

  @Prop()
  usage: string; // 사용처

  @Prop()
  item_img: string;

  @Prop()
  item_name: string;

  @Prop()
  item_description: string;

  @Prop()
  cnt: number; // 잔여 개수

  @Prop()
  skil: string[];

  @Prop()
  deadline: Date | null;

  @Prop()
  type: 'atk' | 'util';

  @Prop()
  price: number;

  @Prop({ default: new Date() })
  get_at: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
