import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ItemDocument = HydratedDocument<Item>;

@Schema()
export class Item {
  @Prop({ required: true })
  item_name: string;

  @Prop({ required: true })
  item_img: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  usage: string; // 사용처 고철장/뱅 /잡템/

  @Prop({ default: 0 })
  cost: number; // AS 가격 그러나 AS의 코스트는 현금 가격이다.

  @Prop({ default: '' })
  item_description: string;

  @Prop({ default: '' })
  skil: string;

  @Prop({ default: 'util' })
  type: 'atk' | 'util';

  @Prop({ default: new Date() })
  get_at: Date;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
