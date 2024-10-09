import { Test, TestingModule } from '@nestjs/testing';
import { Article } from './article.schema';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';


describe("Article Controller", () => {
    let controller: ArticleController;
    let service: ArticleService;

    const mockData : Article[] = [
        Object.assign(new Article, {title: "Article 1", uid: 1, status: "NEW"}),
        Object.assign(new Article, {title: "Article 2", uid: 2, status: "NEW"}),
        Object.assign(new Article, {title: "Article 3", uid: 3, status: "ACCEPTED"})
    ];

    beforeEach(async () => {
        const testingModule : TestingModule = await Test.createTestingModule({
            controllers: [ArticleController],
            providers: [
                {
                    provide: ArticleService,
                    //build mock functions
                    useValue: {
                        find: jest.fn(),
                        findOne: jest.fn(),
                        updateArticle: jest.fn(),
                        addArticle: jest.fn(),
                        deleteArticle: jest.fn(),
                        updatePartially: jest.fn(),
                    }
                }
            ],
        }).compile();

        service = testingModule.get(ArticleService);
        controller = testingModule.get(ArticleController);
    });

    describe('Find Articles', () => {
        it("should return a whole list of articles with no paremters", async () => {
            jest.spyOn(service, "find").mockResolvedValue(mockData);
            expect(await controller.findMatching({})).toBe(mockData);
            expect(service.find).toHaveBeenCalledWith({ text: undefined, submitterUid: undefined, moderatorUid: undefined, analyistUid: undefined, status: undefined });
        });

        it("should return only a limited list of articles when a status is provided", async () => {
            //only new values
            let result = [mockData[0], mockData[1]]
            jest.spyOn(service, "find").mockResolvedValue(result);
            expect(await controller.findMatching({status: "NEW"})).toBe(result);
            expect(service.find).toHaveBeenCalledWith({ text: undefined, submitterUid: undefined, moderatorUid: undefined, analyistUid: undefined, status: "NEW" });

        });
    });
});