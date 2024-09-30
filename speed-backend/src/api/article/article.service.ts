import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Article, ArticleState } from './article.schema';



@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
  ) {}

  async updatePartially(uid: string, patchDto: Partial<Article>): Promise<Article> {
    const updatedArticle = await this.articleModel.findOneAndUpdate(
      { uid },               
      { $set: patchDto },    
      { new: true }           
    ).exec();
  
    console.log("Updated article:", updatedArticle); // Log to verify modNote
    return updatedArticle;
  }

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

  async searchForStatus(targetStatus: string): Promise<Article[]> {
    return await this.articleModel.find({ status: targetStatus });
  }

  async searchForModerator(uid: string): Promise<Article[]> {
    return await this.articleModel.find({ moderatorUid: uid });
  }

    async searchForAnalysist(uid: string): Promise<Article[]>
    {
        return await this.articleModel.find({analyistUid: uid});
    }

    async searchForSubmitter(uid: string): Promise<Article[]> {
        return await this.articleModel.find({ submitterUid: uid });
    }

    async updateArticle(uid: string, newData){
        return await this.articleModel.updateOne({uid}, newData);
    }

    async deleteArticle(uid: string){
        await this.articleModel.deleteOne({uid});
    }



}