import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class InfoUsers extends Document {
  @Prop({ type: String, required: true })
  user: string;

  @Prop({ type: String, required: true })
  pass: string;

  @Prop({ type: String, required: true })
  type: string;

  @Prop({ type: String, required: false })
  link: string;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const InfoUsersSchema = SchemaFactory.createForClass(InfoUsers);
