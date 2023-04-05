import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateChatDto } from 'src/chat/dto/create-chat.dto';

@Injectable()
export class OpenAiService {
  constructor(private readonly httpService: HttpService) {}

  async generateImage(createChatDto: CreateChatDto): Promise<any> {
    const data = JSON.stringify({
      prompt: createChatDto.text,
      n: 2,
      size: '512x512',
    });

    try {
      const response = await this.httpService.axiosRef.post(
        '/images/generations',
        data,
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async askGpt(createChatDto: CreateChatDto) {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: createChatDto.text }],
    });

    try {
      const response = await this.httpService.axiosRef.post(
        '/chat/completions',
        data,
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
