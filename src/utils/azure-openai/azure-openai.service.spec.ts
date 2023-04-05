import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AzureOpenAIService } from './azure-openai.service';

describe('AzureOpenAIService', () => {
  let openaiService: AzureOpenAIService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AzureOpenAIService,
        {
          provide: HttpService,
          useValue: {
            post: jest.fn(),
          },
        },
      ],
    }).compile();

    openaiService = module.get<AzureOpenAIService>(AzureOpenAIService);
    httpService = module.get<HttpService>(HttpService);
  });

  describe('askToGPT', () => {
    it('should call the OpenAI API with the correct parameters', () => {
      const expectedResponse = {
        data: 'Answer to the question',
      };

      jest
        .spyOn(httpService, 'post')
        .mockReturnValue(of(expectedResponse) as any);

      const question = 'What is the meaning of life?';
      openaiService.askToGPT(question).subscribe((response) => {
        expect(httpService.post).toHaveBeenCalledWith(
          '/',
          JSON.stringify({
            prompt: question,
            max_tokens: 4000,
            temperature: 0.7,
            frequency_penalty: 0,
            presence_penalty: 0,
            top_p: 1,
            best_of: 1,
            stop: null,
          }),
        );
        expect(response).toEqual(expectedResponse);
      });
    });
  });
});
