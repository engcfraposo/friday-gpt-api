import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swagger } from './swagger';
import { socket } from './socket';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  socket(app)
  swagger(app);
  await app.listen(3000);
}
bootstrap();
