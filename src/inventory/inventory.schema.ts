import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Item } from 'src/item/item.schema';
import { User } from 'src/user/user.schema';

export type InventoryDocument = HydratedDocument<Inventory>;

@Schema()
export class Inventory {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  owner_id: User;

  @Prop({ type: Types.ObjectId, ref: Item.name, required: true })
  item: Item;

  @Prop({ default: 0 })
  cnt: number;

  @Prop({ default: Date.now() })
  update_at: number;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);
