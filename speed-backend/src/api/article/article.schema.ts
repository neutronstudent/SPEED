import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Article {
  @Prop({ required: true, unique: true })
  uid: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  doi: string;

  @Prop({ required: false })
  moderator: string;

  @Prop({ required: false })
  reviewer: string;

  @Prop({ required: true })
  status: string;
}

export type ArticleDocument = HydratedDocument<Article>;
export const UserSchema = SchemaFactory.createForClass(Article);
