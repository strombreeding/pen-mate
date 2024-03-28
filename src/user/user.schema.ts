import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Inventory } from 'src/inventory/inventory.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ type: Types.ObjectId, auto: true })
  _id: Types.ObjectId;

  @Prop()
  social_id: string;

  @Prop()
  email: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ default: 0 })
  play_count: number;

  @Prop({ default: '' })
  rt: string;

  @Prop({ default: new Date() })
  last_connection: Date;

  @Prop({ default: false })
  bounti: boolean;

  @Prop({ default: new Date() })
  create_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
