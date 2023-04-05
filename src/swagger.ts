import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function swagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('OpenAI example')
    .setDescription('Microserviços de IA')
    .setVersion('1.0')
    .addTag('openai')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
