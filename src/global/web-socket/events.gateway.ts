import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import 'dotenv/config';
import { Server } from 'ws';
    
@WebSocketGateway( 
    Number(process.env.WEBSOCKET_PORT),  
    { 
        transports: ['websocket'],
        cors: { origin: '*' },
    } 
)
export class EventsGateway {
    
    @WebSocketServer()
    server: Server;

    // this execute after Init listen websocket
    afterInit() {
        console.warn(`Init WebSocket Server - Port:${process.env.WEBSOCKET_PORT}`);
    }

    // validate Connection with webSocket
    public async handleConnection(client: any, req: Request) {
        console.log('Client connected');
    }

    // method listen when client disconnected
    public async handleDisconnect(client: any) {
        // check if public api node
        console.log('Client Disconnected');
    }

    @SubscribeMessage('create-band')
    handleEventCreateBand( @ConnectedSocket() client: Socket, @MessageBody() data: string,): string {
        console.log(data);
        return data;
    }

    @SubscribeMessage('Delete-band')
    handleEventDeleteBand( @ConnectedSocket() client: Socket, @MessageBody() data: string,): string {
        console.log(data);
        return data;
    }

    // @SubscribeMessage('create-band')
    // public handleEventAddBand( client: Socket, message: any): string {
    //     console.log(message, client);
    //     return message;
    // }
}