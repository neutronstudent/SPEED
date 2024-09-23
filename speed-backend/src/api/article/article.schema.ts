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
  moderatorUid: string;

  @Prop({ required: false })
  reviewerUid: string;

  @Prop({ required: true })
  status: string;
}

export class CreateArticleDto {
    title: string
    doi: string
}

export type ArticleDocument = HydratedDocument<Article>;
export const ArticleSchema = SchemaFactory.createForClass(Article);
