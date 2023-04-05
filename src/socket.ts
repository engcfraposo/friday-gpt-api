import { INestApplication } from '@nestjs/common';
import { WsAdapter } from '@nestjs/platform-ws';


export function socket(app: INestApplication) {
  app.useWebSocketAdapter(new WsAdapter(app));
}
