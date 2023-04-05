import { Module } from '@nestjs/common';
import { AzureOpenAIService } from './azure-openai.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('AZURE_OPENAI_API'),
        headers: {
          'Content-Type': 'application/json',
          'api-key': configService.get('AZURE_OPENAI_KEY'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [AzureOpenAIService],
  exports: [AzureOpenAIService],
})
export class AzureOpenAIModule {}
