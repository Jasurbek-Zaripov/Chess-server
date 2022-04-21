import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class SocketService {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('moved')
    handleDate(@MessageBody() body: SocketBody) {
        this.server.emit('update', body);
    }
}
export interface SocketBody {
    coordinate: string;
    newcoordinate: string;
    figure: string;
    player: string;

}