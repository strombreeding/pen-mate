import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema()
export class Payment {
  @Prop({ required: true })
  buyer_id: string;

  @Prop({ required: true })
  cost_atata_stone: number;

  @Prop({ required: true })
  item_id: string;

  @Prop({ required: true })
  cnt: number;

  @Prop({ default: 0 })
  cost_cash: 0;

  @Prop({ default: new Date() })
  pay_at: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
