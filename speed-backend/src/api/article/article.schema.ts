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

  @Prop({required: false})
  journalName: string

  @Prop({required: false})
  yearOfPub: Date

  @Prop({required: false})
  vol: Number

  @Prop({required: false})
  pages: Number

  @Prop({required: false})
  SEP: string

  @Prop({required: false})
  claim: string

  @Prop({required: false})
  result: string

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
    authors: string[]
    journalName: string
    yearOfPub: Date
    vol: Number
    pages: Number
    SEP: string
    claim: string
    result: string
}

export type ArticleDocument = HydratedDocument<Article>;
export const ArticleSchema = SchemaFactory.createForClass(Article);
