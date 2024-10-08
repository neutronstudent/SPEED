import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { error } from 'console';
import {
  Article,
  ArticlePatchDto,
  ArticleState,
  CreateArticleDto,
} from './article.schema';
import { randomUUID } from 'crypto';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  async findAllMatching(
    @Query('search') search: string,
    @Query('status') status?: string, // Optional status query parameter
  ) {
    try {
      // If status is provided, filter based on status
      if (status) {
        return this.articleService.searchForStatus(status);
      }

      // If no status is provided, return all matching articles
      return this.articleService.findAll();
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No Articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Get('/id/:uid')
  async findOne(@Param('uid') uid: string) {
    try {
      return this.articleService.findOne(uid);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Article not found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Put('/id/:uid')
  async updateArticle(
    @Param('uid') uid: string,
    @Body() articleDto: CreateArticleDto,
  ) {
    try {
      const article = Object.assign(new Article(), articleDto);
      article.yearOfPub = new Date(article.yearOfPub);
      console.log(article);
      return this.articleService.updateArticle(uid, article);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Unable to update article',
        },
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
  /*
  //update important fields
  @Patch('/id/:uid')
  async patchArticle(@Param('uid') uid: string, @Body() patchDto: ArticlePatchDto) {
    try {
      return this.articleService.updateArticle(uid, patchDto);  
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Article not found',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }*/

  //search routes for searching for articles based upon strings and moderators
  //by default only show approved articles unless query paramater says otherwise
  @Get('/search')
  async findText(
    @Query('text') searchStr: string,
    @Query('status') statusQuery: string = ArticleState.APPROVED, // Comma-separated statuses
  ) {
    try {
      // Split the statusQuery string by commas into an array of statuses
      const statuses: ArticleState[] = statusQuery.split(',') as ArticleState[];
  
      // Pass the search string and the array of statuses to the service
      return this.articleService.searchArticles(searchStr, statuses);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found or server error',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  //get all articles with moderator uid
  @Get('/moderator/:uid')
  async findModerator(@Param('uid') uid: string) {
    try {
      return this.articleService.searchForModerator(uid);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  //get all articles with reviewer uid
  @Get('/analyist/:uid')
  async findAnalyist(@Param('uid') uid: string) {
    try {
      return this.articleService.searchForAnalysist(uid);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Get('/submitter/:uid')
  async findSubmitter(@Param('uid') uid: string) {
    try {
      return this.articleService.searchForSubmitter(uid);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Get('/status/:status')
  async findStatus(@Param('status') status: string) {
    try {
      return this.articleService.searchForStatus(status);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'No articles found',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  @Post('/')
  async createArticle(@Body() articleDto: CreateArticleDto) {
    try {
      const article = Object.assign(new Article(), articleDto);
      article.uid = randomUUID();

      article.status = ArticleState.NEW;

      return this.articleService.addArticle(article);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Unable to add article',
        },
        HttpStatus.NOT_ACCEPTABLE,
        { cause: error },
      );
    }
  }

  @Delete('/id/:uid')
  async deleteArticle(@Param('uid') uid: string) {
    try {
      this.articleService.deleteArticle(uid);

      return HttpStatus.ACCEPTED;
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Unable to delete article',
        },
        HttpStatus.NOT_ACCEPTABLE,
        { cause: error },
      );
    }
  }

  @Patch('/id/:uid')
  async updatePartially(
    @Param('uid') uid: string,
    @Body() patchDto: ArticlePatchDto,
  ) {
    console.log('Received patchDto:', patchDto);
    try {
      const updatedArticle = await this.articleService.updatePartially(
        uid,
        patchDto,
      );
      return updatedArticle;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Article not found or failed to update',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
