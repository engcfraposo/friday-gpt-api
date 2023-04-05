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
import internal from 'stream';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('/ask')
  askToGpt(@Body() createChatDto: CreateChatDto) {
    return this.chatService.askToGpt(createChatDto);
  }

  @Post('/image')
  generateImg(@Body() createChatDto: CreateChatDto) {
    return this.chatService.generateImg(createChatDto);
  }

  @Post('/text-to-speech')
  async textToSpeech(
    @Body() createChatDto: CreateChatDto,
    @Res() res: Response,
  ) {
    const result = await this.chatService.textToSpeech(createChatDto);

    res.set({
      'Content-Type': 'audio/mpeg',
      'Transfer-Encoding': 'chunked',
    });

    result.pipe(res);
  }

  @Post('/transcribe')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Arquivo de Audio',
    type: FileChatDto,
  })
  @UseInterceptors(FileInterceptor('file'))
  async audioToText(@UploadedFile() file: any) {
    const audio = file.buffer;
    const transcription = await this.chatService.transcribeAudio(audio);
    return transcription;
  }

  @Post('/bot')
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
