import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, WebSocket } from 'ws';

@WebSocketGateway(3333)
export class WSGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() client: WebSocket;
  handleDisconnect(_client: WebSocket) {
    const startTime = Date.now();
    console.log(
      `[${new Date(startTime)}] - client desconectado o modulo de websockets`,
    );
    this.client = null;
  }
  afterInit() {
    const startTime = Date.now();
    console.log(`[${new Date(startTime)}] - Iniciando o modulo de websockets`);
  }

  handleConnection(client: WebSocket, ...args: any[]) {
    const startTime = Date.now();
    console.log(
      `[${new Date(startTime)}] - client conectado o modulo de websockets`,
    );
    client.send('Client conectado');
    this.client = client;
  }

  sendMessage(data: string) {
    const startTime = Date.now();
    console.log(`[${new Date(startTime)}] - enviando mensagem para clientes`);
    this.client.send(data);
  }
}
