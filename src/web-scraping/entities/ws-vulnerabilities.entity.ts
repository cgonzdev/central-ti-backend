import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

const Technologies = {
  name: { type: String, required: true },
  owner: { type: String, required: true },
};

interface iTechnologies {
  name: string;
  owner: string;
}

@Schema({ timestamps: true })
export class WSVulnerabilities extends Document {
  @Prop({ type: String, required: true, unique: true })
  tag: string;

  @Prop({ type: [Technologies], required: true })
  technologies: iTechnologies[];

  @Prop({ type: Date, default: null })
  deletedAt: Date;
}

export const WSVulnerabilitiesSchema =
  SchemaFactory.createForClass(WSVulnerabilities);
