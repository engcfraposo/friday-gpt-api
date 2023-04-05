import { Module } from '@nestjs/common';
import { OpenAiService } from './openai.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        baseURL: configService.get('OPENAI_API'),
        timeout: 0,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${configService.get('OPENAI_KEY')}`,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
  ],
  providers: [OpenAiService],
  exports: [OpenAiService],
})
export class OpenAiModule {}
