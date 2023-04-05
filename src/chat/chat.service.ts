import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { OpenAiService } from 'src/utils/openai/openai.service';
import { AzureOpenAIService } from 'src/utils/azure-openai/azure-openai.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly azureOpenAiService: AzureOpenAIService,
  ) {}
  async transcribeAudio(audio: Buffer) {
    const startTime = Date.now();
    console.log(
      `[${new Date(startTime)}] - Iniciando o processo de transcrição do bot`,
    );
    const result = await this.azureOpenAiService.transcribe(audio);
    console.log(
      `[${new Date(startTime)}] - Finalizando o processo de transcrição do bot`,
    );
    return result;
  }

  async textToSpeech(createChatDto: CreateChatDto) {
    const startTime = Date.now();
    console.log(
      `[${new Date(startTime)}] - Iniciando o processo de fala do bot`,
    );
    const result = await this.azureOpenAiService.textToSpeech(
      createChatDto.text,
    );
    console.log(
      `[${Date.now() - startTime} ms] - Finalizando o processo de fala do bot `,
    );
    return result;
  }

  async generateImg(createChatDto: CreateChatDto) {
    const startTime = Date.now();
    console.log(
      `[${new Date(startTime)}] - Iniciando o processo de gerar imagens sobre ${
        createChatDto.text
      }`,
    );
    const result = await this.openAiService.generateImage(createChatDto);
    console.log(
      `[${
        Date.now() - startTime
      } ms] - Finalizando o processo de gerar imagens sobre ${
        createChatDto.text
      }`,
    );
    return result;
  }
  async askToGpt(createChatDto: CreateChatDto) {
    const startTime = Date.now();
    console.log(
      `[${new Date(
        startTime,
      )}] - Iniciando o processo de consulta ao GPT sobre ${
        createChatDto.text
      }`,
    );
    const result = await this.openAiService.askGpt(createChatDto);
    console.log(
      `[${
        Date.now() - startTime
      } ms] - Finalizando o processo de consulta ao GPT sobre ${
        createChatDto.text
      }`,
    );
    return result;
  }

  async askToBot(audio: Buffer) {
    const startTime = Date.now();
    console.log(
      `[${new Date(
        startTime,
      )}] - Iniciando o processo de consulta ao BOT por audio`,
    );
    const transcribe = await this.transcribeAudio(audio);
    console.log(
      `[${
        Date.now() - startTime
      } ms] - Finalizando o processo de consulta ao BOT por audio`,
    );
    console.log(transcribe)
    if (
      transcribe.text.includes('imagem') ||
      transcribe.text.includes('Imagem')
    ) {
      const image = await this.generateImg(transcribe);
      return image.data;
    } else {
      const data = await this.askToGpt(transcribe);
      const text = data.choices[0].message.content;
      const textToSpeech = await this.textToSpeech({ text });
      return textToSpeech;
    }
  }
}
