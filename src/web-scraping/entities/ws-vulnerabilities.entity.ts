import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const Technologies = {
  name: { type: String, required: true },
  description: { type: String, required: true },
};

interface iTechnologies {
  name: string;
  description: string;
}

@Schema({ timestamps: true })
export class WSVulnerabilities extends Document {
  @Prop({ type: String, required: true, unique: true })
  customer: string;

  @Prop({ type: [Technologies], required: true })
  technologies: iTechnologies[];

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const WSVulnerabilitiesSchema =
  SchemaFactory.createForClass(WSVulnerabilities);
