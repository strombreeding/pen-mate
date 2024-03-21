import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  social_id: string;

  @Prop()
  email: string;

  @Prop({ required: true, unique: true })
  nickname: string;

  @Prop({ default: 5 })
  energy: number;

  @Prop({ default: 0 })
  atata_stone: number;

  @Prop({ default: 0 })
  atata_point: number;

  @Prop({ default: 0 })
  play_count: number;

  @Prop({ default: '' })
  rt: string;

  @Prop({ default: new Date() })
  last_connection: Date;

  @Prop({ default: new Date() })
  create_at: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
