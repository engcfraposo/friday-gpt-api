import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenAiModule } from 'src/utils/openai/openai.module';
import { AzureOpenAIModule } from 'src/utils/azure-openai/azure-openai.module';
import { WsModule } from 'src/ws/ws.module';

@Module({
  imports: [OpenAiModule, AzureOpenAIModule, WsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
