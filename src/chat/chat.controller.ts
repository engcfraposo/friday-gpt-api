import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileChatDto } from './dto/file-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/ask-gpt')
  async askToGpt(@Body() createChatDto: CreateChatDto) {
    const startTime = Date.now();
    console.log(
      `[${new Date(startTime)}] - Iniciando o controlador de consulta ao GPT`,
    );
    const result = this.chatService.askToGpt(createChatDto);
    console.log(
      `[${
        Date.now() - startTime
      } ms] - Finalizando o controlador de consulta ao GPT`,
    );
    return result;
  }

  @Post('/generate-image')
  async generateImg(@Body() createChatDto: CreateChatDto) {
    const startTime = Date.now();
    console.log(
      `[${new Date(
        startTime,
      )}] - Iniciando o controlador de geração de Imagem do DALL.E`,
    );
    const result = this.chatService.generateImg(createChatDto);
    console.log(
      `[${
        Date.now() - startTime
      } ms] - Finalizando o controlador de geração de Imagem do DALL.E`,
    );
    return result;
  }

  @Post('/text-to-speech')
  async textToSpeech(
    @Body() createChatDto: CreateChatDto,
    @Res() res: Response,
  ) {
    const startTime = Date.now();
    console.log(
      `[${new Date(
        startTime,
      )}] - Iniciando o controlador de conversão de texto para audio`,
    );
    const result = await this.chatService.textToSpeech(createChatDto);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    });
    console.log(
      `[${
        Date.now() - startTime
      } ms] - finalizando o controlador de conversão de texto para audio`,
    );
    result.pipe(res);
  }

  @Post('/transcribe-text')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de Audio',
    type: FileChatDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async audioToText(@UploadedFile() file: any) {
    const startTime = Date.now();
    console.log(
      `[${new Date(
        startTime,
      )}] - Iniciando o controlador de conversão de audio para texto`,
    );
    const audio = file.buffer;
    const transcription = await this.chatService.transcribeAudio(audio);
    console.log(
      `[${
        Date.now() - startTime
      } ms] - finalizando o controlador de conversão de audio para texto`,
    );
    return transcription;
  }

  @Post('/ask-bot')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de Audio',
    type: FileChatDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async askToBot(@UploadedFile() file: any, @Res() res: Response) {
    const startTime = Date.now();
    console.log(
      `[${new Date(startTime)}] - Iniciando o controlador de perguntas do bot`,
    );
    const audio = file.buffer;
    const result = await this.chatService.askToBot(audio);
    const isPassThrough = !!result._readableState;
    if (!isPassThrough) {
      return res.json(result);
    }
    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    });
    result.pipe(res);
    console.log(
      `[${
        Date.now() - startTime
      } ms] - finalizando o controlador de perguntas do bot`,
    );
  }
}
