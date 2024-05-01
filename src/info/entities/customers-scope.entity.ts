import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const Leaders = {
  name: { type: String, required: true },
  email: { type: String, required: true },
};

interface iLeaders {
  name: string;
  email: string;
}

const Services = {
  name: { type: String, required: true },
  description: { type: String, required: true },
  enabled: { type: Boolean, required: true },
  icon: { type: String, required: true },
};

interface iServices {
  name: string;
  description: string;
  enabled: boolean;
  icon: string;
}

@Schema({ timestamps: true })
export class CustomerScope extends Document {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  acronym: string;

  @Prop({ type: String, required: true })
  logo: string;

  @Prop({ type: String, required: true })
  owner: string;

  @Prop({ type: [Leaders], required: true })
  leaders: Document<[iLeaders]>;

  @Prop({ type: [Services], required: true })
  services: Document<[iServices]>;

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const CustomerScopeSchema = SchemaFactory.createForClass(CustomerScope);
