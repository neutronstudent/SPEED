import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, } from '@nestjs/common';
import { ArticleService } from "./article.service";
import { error, log } from 'console';
import { Article, ArticlePatchDto, ArticleState, CreateArticleDto} from './article.schema';
import { randomUUID } from 'crypto';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

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

  //compleatly update data object
  @Put('/:uid')
  async updateArticle(
    @Param('uid') uid: string,
    @Body() articleDto: CreateArticleDto,
  ) {
    try {
      const article = Object.assign(new Article(), articleDto);
      return this.articleService.updateArticle(uid, article);
    } catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_ACCEPTABLE,
          error: 'Unable to update article',
        },
        HttpStatus.NOT_ACCEPTABLE,
        { cause: error },
      );
    }
  }

  //update important fields
  @Patch('/:uid/')
  async patchArticle(@Param('uid') uid: string,  patchDto: ArticlePatchDto) {
    try {
      return this.articleService.updateArticle(uid, patchDto);
    }

    catch {
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
      
      return HttpStatus.ACCEPTED

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
}
