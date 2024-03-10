import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import 'dotenv/config';
import { AuthService } from 'src/auth/services/auth.service';
import { User } from 'src/schemas/user.schema';
import { Server } from 'ws';
    
@WebSocketGateway( 
    Number(process.env.WEBSOCKET_PORT),  
    { 
        transports: ['websocket'],
        cors: { origin: '*' },
    } 
)
export class EventsGateway {
    
    constructor(private authService: AuthService){ }

    @WebSocketServer()
    server: Server;
    public users: Socket[] = [];

    // this execute after Init listen websocket
    afterInit() {
        console.warn(`Init WebSocket Server - Port:${process.env.WEBSOCKET_PORT}`);
    }

    // validate Connection with webSocket
    public async handleConnection(@ConnectedSocket() client: Socket, req: Request) {

        const token = req.headers['x-token'];
        if (!token) return client.disconnect();
        const pr = this.AddClient(token, client);
        if (!pr) return client.disconnect();
    }

    public async AddClient(token: string, client) {
        try {
            const user  = await this.authService.verifyTokenAndSetOnline(token);
            if (!user) return false;
            client['user'] = user;
            this.users.push(client);
            console.log(`Client connected, Total UsersConnected: ${this.users.length}`);
        } catch (error) {
            return false;
        }
    }

    // method listen when client disconnected
    public async handleDisconnect(@ConnectedSocket() client: Socket) {
        // check if public api node
        await this.authService.disconnect(client['user'] as User);
        console.log(`Client Disconnected, Total UsersConnected: ${this.users.length}`);
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