import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class CustomerEmail extends Document {
  @Prop({ type: String, required: true })
  customer: string;

  @Prop({ type: String, required: true, unique: true })
  reason: string;

  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: String, required: true })
  to: string;

  @Prop({ type: String, required: true })
  cc: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const CustomerEmailSchema = SchemaFactory.createForClass(CustomerEmail);
