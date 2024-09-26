import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum ArticleState {
  NEW = 'NEW',
  MODERATATING = 'MODERATATING',
  ANALYSING = 'ANALYSING',
  APPROVED = 'APPROVED',
  DENIED = 'DENIED'
}

@Schema()
export class Article {
  @Prop({ required: true, unique: true })
  uid: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  submitterUid: string;

  @Prop({ required: false })
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
  analyistUid: string;

  @Prop({type: String, enum: ArticleState, default: ArticleState.NEW, required: true })
  status: ArticleState;
}

export class CreateArticleDto {
  title: string;
  doi: string;
  authors: string[];
  journalName: string;
  yearOfPub: Date;
  vol: Number;
  pages: Number;
  submitterUid: string;
  SEP: string;
  claim: string;
  result: string;
}

export class ArticlePatchDto {
  moderatorUid?: string
  analyistUid?: string;
  status?: ArticleState;
}

export type ArticleDocument = HydratedDocument<Article>;
export const ArticleSchema = SchemaFactory.createForClass(Article);
