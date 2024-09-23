import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Query, } from '@nestjs/common';
import { ArticleService } from "./article.service";
import { error } from 'console';
import { Article, CreateArticleDto } from './article.schema';
import { randomUUID } from 'crypto';

@Controller('api/articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  async findAllMatching(@Query('search') search: String) {
    try {
      return this.articleService.findAll();
    }

    catch {
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

  @Get('/search')
  async findText(@Query('text') searchStr: string)
  {
    try {
      return this.articleService.searchForText(searchStr);
    }

    catch {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Missing search',
        },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );

    }
  }

  @Get('/moderator/:uid')
  async findModerator(@Param('uid') uid: string) {
    try {
      return this.articleService.searchForModerator(uid)
    }

    catch {
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

  @Get('/reviewer/:uid')
  async findReviewer(@Param('uid') uid: string) {
    try {
      return this.articleService.searchForReviewer(uid)
    }

    catch {
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
      return this.articleService.searchForStatus(status)
    }

    catch {
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
  async createArticle(@Body() articleDto: CreateArticleDto)
  {
    try {
      var article = Object.assign(new Article(), articleDto);
      article.uid = randomUUID();
      article.status = "new";

      return this.articleService.addArticle(article);
    }

    catch {
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
}
