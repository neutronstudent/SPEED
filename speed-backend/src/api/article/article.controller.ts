import { ArticleService } from "./article.service";

export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}
}