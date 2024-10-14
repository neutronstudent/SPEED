
import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, } from '@nestjs/common';
import { ArticleService } from "./article.service";
import { error, log } from 'console';
import { Article, ArticlePatchDto, ArticleState, CreateArticleDto} from './article.schema';

import { randomUUID } from 'crypto';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/search-by-doi')
  async findByDOI(@Query('doi') doi: string) {
    if (!doi) {
      throw new HttpException('DOI is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const article = await this.articleService.findByDOI(doi);
      if (article) {
        console.log('Article found in controller:', article);
      // Manually stringify and parse to ensure serialization
        const serializedArticle = JSON.parse(JSON.stringify(article));
        return serializedArticle;
      } else {
        console.log('No article found with this DOI');
        throw new HttpException('No article found with this DOI', HttpStatus.NOT_FOUND);
      }
    } catch (error) {
      console.error('Error searching for DOI:', error);
      throw new HttpException('Error searching for DOI', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get('/')
  async findMatching(@Query() params: any) {
    try {
      //if no paramters by default return all
      //pass paramters to backendx
        log(params)
        return this.articleService.find({text: params.text, submitterUid: params.submitter, moderatorUid: params.moderator, analyistUid: params.analyist, status: params.status});
      
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

  @Get('/:uid')
  async findOne(@Param('uid') uid: string) {
    try {
      const article = await this.articleService.findOne(uid);
      console.log('Article retrieved from database:', article);
      return article;
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

  //compleatly update data object
  @Put('/:uid')
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

  @Delete('/:uid')
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

  @Patch('/:uid')
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
