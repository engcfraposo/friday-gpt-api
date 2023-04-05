import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { OpenAiModule } from 'src/utils/openai/openai.module';
import { AzureOpenAIModule } from 'src/utils/azure-openai/azure-openai.module';

@Module({
  imports: [OpenAiModule, AzureOpenAIModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
