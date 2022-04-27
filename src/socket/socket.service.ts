import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
@WebSocketGateway()
export class SocketService implements OnGatewayDisconnect, OnGatewayConnection {
    @WebSocketServer()
    server: Server;
    messages = [];
    users = [];
    id: any;

    constructor() {
    }

    handleConnection(client: Socket) {
        this.users.push(client.id);
    }

    @SubscribeMessage('name:get')
    getName(@ConnectedSocket() client: Socket) {
        this.server.emit('name:send', client.id);
    }
    @SubscribeMessage('write')
    onWrite(@ConnectedSocket() client: Socket) {
        this.users.forEach(id => {
            if (id != client.id) {
                this.server.to(id).emit('writed');
            }
        });
    }

    @SubscribeMessage('moved')
    handleDate(@MessageBody() body: SocketBody) {
        this.server.emit('update', body);
    }
    @SubscribeMessage('message')
    handleMessage(@MessageBody() body: chatBody) {
        if (body && body.name) {
            this.messages.push({ name: body.name, message: body.message, time: body.time });
            if (!this.id) {
                this.id = setInterval(() => {
                    if (this.messages.shift()) this.server.emit('messages', this.messages);
                    else {
                        clearInterval(this.id);
                        this.id = null;
                    }
                }, 10000);
            }
        }
        this.server.emit('messages', this.messages);
    }

    handleDisconnect(client: Socket) {
        this.users = this.users.filter(id => id != client.id);
        this.server.emit('exit');
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