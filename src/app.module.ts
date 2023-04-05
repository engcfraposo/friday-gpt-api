import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AzureOpenAIModule } from './utils/azure-openai/azure-openai.module';
import { OpenAiModule } from './utils/openai/openai.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { WsModule } from './ws/ws.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AzureOpenAIModule,
    OpenAiModule,
    ChatModule,
    WsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
