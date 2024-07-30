import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: false, default: 'N/A' })
  description: string;

  @Prop({ type: [String], required: false, default: ['readonly'] })
  roles: string[];

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
