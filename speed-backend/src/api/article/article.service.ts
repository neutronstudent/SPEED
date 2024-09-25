import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Article } from './article.schema';

@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async addArticle(newArticle: Article): Promise<Article> {
    return await this.articleModel.create(newArticle);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }

  async findOne(uid: string): Promise<Article> {
    return await this.articleModel.findOne({ uid }).exec();
  }

  async searchForText(searchText: string): Promise<Article[]> {
    const query = { $text: { $search: searchText } };

    const sort = { score: { $meta: 'textScore' } };

    //searches both titles and bodies for releveant text
    return this.articleModel.find(query).sort(sort).exec();
  }

  async searchForStatus(targetStatus: string): Promise<Article[]> {
    return await this.articleModel.find({ status: targetStatus });
  }

  async searchForModerator(uid: string): Promise<Article[]> {
    return await this.articleModel.find({ moderatorUid: uid });
  }

  async searchForReviewer(uid: string): Promise<Article[]> {
    return await this.articleModel.find({ reviewerUid: uid });
  }

  async searchForSubmitter(uid: string): Promise<Article[]> {
    return await this.articleModel.find({ submitterUid: uid }).exec();
  }
}
