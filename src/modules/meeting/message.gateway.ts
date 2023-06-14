import { UseGuards } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

enum WSEvents {
  UPDATE_USERS_LIST = 'users-list',
  ADD_USER = 'add-user',
}

@WebSocketGateway({
  namespace: 'videochat',
  cors: {
    origin: '*',
  },
})
export class MessageGateway
  implements OnGatewayInit, OnGatewayDisconnect, OnGatewayConnection
{
  @WebSocketServer() server: Server;
  private activeSockets: { room: string; id: string }[] = [];

  @SubscribeMessage('join')
  public joinRoom(client: Socket, room: string) {
    const existingSocket = this.activeSockets.find((socket) => {
      return socket.room === room && socket.id === client.id;
    });

    if (existingSocket) return;

    this.activeSockets.push({ room, id: client.id });
    client.join(room);

    // send to new joined user list of users in room
    client.emit(WSEvents.UPDATE_USERS_LIST, {
      users: this.activeSockets
        .filter((socket) => socket.room === room && socket.id !== client.id)
        .map((socket) => socket.id),
      current: client.id,
    });

    client.to(room).emit(WSEvents.ADD_USER, {
      user: client.id,
    });

    console.log(this.activeSockets);
  }

  @SubscribeMessage('call-user')
  public callUser(client: Socket, data: any): void {
    client.to(data.to).emit('call-made', {
      offer: data.offer,
      socket: client.id,
    });
  }

  @SubscribeMessage('make-answer')
  public makeAnswer(client: Socket, data: any): void {
    client.to(data.to).emit('answer-made', {
      socket: client.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage('reject-call')
  public rejectCall(client: Socket, data: any): void {
    client.to(data.from).emit('call-rejected', {
      socket: client.id,
    });
  }

  @SubscribeMessage('test')
  public test(client: Socket, data: any) {
    console.log('test', data);
  }
  public afterInit(...args): void {
    console.log('Init');
    console.log(args);
  }

  public handleConnection(client: Socket, ...args: any[]) {
    console.log('dsasdas', client.id, args);
  }

  public handleDisconnect(client: Socket): void {
    const existingSocket = this.activeSockets.find(
      (socket) => socket.id === client.id,
    );

    if (!existingSocket) return;

    this.activeSockets = this.activeSockets.filter(
      (socket) => socket.id !== client.id,
    );

    client.broadcast.emit(`${existingSocket.room}-remove-user`, {
      socketId: client.id,
    });

    console.log(`Client disconnected: ${client.id}`);
  }
}
