import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { OpenAiService } from './openai.service';

describe('AzureOpenAIService', () => {
  let openaiService: OpenAiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OpenAiService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    openaiService = module.get<OpenAiService>(OpenAiService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('generateImage', () => {
    it('should call the OpenAI API with the correct parameters', () => {
      const expectedResponse = {
        data: 'image-data',
      };

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of(expectedResponse) as any);

      const question = 'tazmania in brazil';
      openaiService.generateImage(question).subscribe((response) => {
        expect(httpService.post).toHaveBeenCalledWith(
          '/',
          JSON.stringify({
            prompt: question,
            n: 2,
            size: '512x512',
          }),
        );
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
