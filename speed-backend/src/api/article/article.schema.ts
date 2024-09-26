import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Article {
  @Prop({ required: true, unique: true })
  uid: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  authors: string;

  @Prop({ required: false })
  doi: string;

  @Prop({ required: false })
  journalName: string;

  @Prop({ required: false })
  yearOfPub: Date;

  @Prop({ required: false })
  vol: string;

  @Prop({ required: false })
  pages: string;

  @Prop({ required: false })
  SEP: string;

  @Prop({ required: false })
  claim: string;

  @Prop({ required: false })
  result: string;

  @Prop({ required: false })
  moderatorUid: string;

  @Prop({ required: false })
  reviewerUid: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  submitterUid: string;
}

export class CreateArticleDto {
  title: string;
  doi: string;
  authors: string;
  journalName: string;
  yearOfPub: Date;
  vol: string;
  pages: string;
  SEP: string;
  claim: string;
  result: string;
  status: string;
  submitterUid: string;
}
export type ArticleDocument = HydratedDocument<Article>;
export const ArticleSchema = SchemaFactory.createForClass(Article);

ArticleSchema.index({ title: 'text', claim: 'text', result: 'text' });
