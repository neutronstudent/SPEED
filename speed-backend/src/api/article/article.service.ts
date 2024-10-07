import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Article, ArticleState } from './article.schema';
import { log } from 'console';



@Injectable()
export class ArticleService {
  constructor(@InjectModel(Article.name) private articleModel: Model<Article>,) {}

  async addArticle(newArticle: Article): Promise<Article> {
    return await this.articleModel.create(newArticle);
  }

  async findAll(): Promise<Article[]> {
    return await this.articleModel.find().exec();
  }
        
  async findOne(uid: string): Promise<Article> {
    return await this.articleModel.findOne({uid}).exec();
  }
    
  async searchArticles(searchText: string, status: ArticleState): Promise<Article[]> {
        
    const query = {$text: {$search: searchText}, status};

    const sort = { score: { $meta: "textScore" } };

    //searches both titles and bodies for releveant text
    return this.articleModel.find(query).sort(sort).exec();
  }

  async updateArticle(uid: string, newData){
     return await this.articleModel.updateOne({uid}, newData);
  }

  async deleteArticle(uid: string){
    await this.articleModel.deleteOne({uid});
  }

  async find(params: {text, submitterUid, moderatorUid, analyistUid, status}): Promise<Article[]> {
    let query = Object.assign({}, params);
    delete query.text;
    if (params.text !== undefined)
    {
       query = Object.assign(query, {$text: {$search: params.text}});
    }
    
    for (let key in query)
    {
      if (query[key] === undefined)
      {
        delete query[key];
      }
    }

    log(query);

    
    //log(query);
    let result = this.articleModel.find(query);
    if (params.text !== undefined)
    {
      result = result.sort({ score: { $meta: "textScore" } });
    }
    
    return await result.exec()
  }
}