import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
@WebSocketGateway()
export class SocketService {
    @WebSocketServer()
    server: Server;
    messages = [];

    @SubscribeMessage('name:get')
    getName(@ConnectedSocket() client: any) {
        this.server.emit('name:send', client.id);
    }
    @SubscribeMessage('moved')
    handleDate(@MessageBody() body: SocketBody) {
        this.server.emit('update', body);
    }

    @SubscribeMessage('message')
    handleMessage(@MessageBody() body: chatBody) {
        if (body && body.name) this.messages.push({ name: body.name, message: body.message, time: body.time });
        this.server.emit('messages', this.messages);
    }
}
export interface SocketBody {
    coordinate: string;
    newcoordinate: string;
    figure: string;
    player: string;

}
export interface chatBody {
    name: string,
    message: string;
    time: string;
}