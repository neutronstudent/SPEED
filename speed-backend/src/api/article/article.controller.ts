import { Body, Controller, Get, HttpException, HttpStatus, Param, Patch, Post, Put, Query, } from '@nestjs/common';
import { ArticleService } from "./article.service";
import { error } from 'console';
import { Article, ArticlePatchDto, ArticleState, CreateArticleDto} from './article.schema';
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

  //compleatly update data object
  @Put('/id/:uid')
  async patchOne(@Param('uid') uid: string, @Body() dto: CreateArticleDto) {
    try {
      return this.articleService.updateObject(uid, dto);
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
  //update important fields
  @Patch('/id/:uid/')
  async patchArticle(@Param('uid') uid: string,  patchDto: ArticlePatchDto) {
    try {
      return this.articleService.updateObject(uid, patchDto);
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



  //search routes for searching for articles based upon strings and moderators
  //by default only show approved articles unless query paramater says otherwise
  @Get('/search')
  async findText(@Query('text') searchStr: string, @Query('status') status: ArticleState = ArticleState.APPROVED)
  {
    try {
      return this.articleService.searchArticles(searchStr, status);
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

  //get all articles with moderator uid
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

  //get all articles with reviewer uid
  @Get('/analyist/:uid')
  async findAnalyist(@Param('uid') uid: string) {
    try {
      return this.articleService.searchForAnalysist(uid)
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

  //get all articles with selected status
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
      article.status = ArticleState.NEW;

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
