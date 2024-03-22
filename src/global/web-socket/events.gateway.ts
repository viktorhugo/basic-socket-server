import {
    ConnectedSocket,
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets';
import { Socket } from 'dgram';
import 'dotenv/config';
import { NewUserMessageDto, RequestUserMessageDto } from 'src/auth/dto/auth.dto';
import { AuthService } from 'src/auth/services/auth.service';
import { MessageService } from 'src/messages/services/message.service';
import { Server } from 'ws';
    
@WebSocketGateway( 
    Number(process.env.WEBSOCKET_PORT),  
    { 
        transports: ['websocket'],
        cors: { origin: '*' },
    } 
)
export class EventsGateway {
    
    constructor(
        private authService: AuthService,
        private messageService: MessageService,
    ){ }

    @WebSocketServer()
    server: Server;
    public users: Socket[] = [];

    // this execute after Init listen websocket
    afterInit() {
        console.warn(`Init WebSocket Server - Port:${process.env.WEBSOCKET_PORT}`);
    }


    //* =======================================================================================
    //*                                HANDLE WSS CONNECTION
    //* =======================================================================================

    // validate Connection with webSocket
    public async handleConnection(@ConnectedSocket() client, req: Request) {

        const token = req.headers['x-token'];
        if (!token) {
            console.error('Missing auth token for connection');
            return client.close();
        }
        const pr = await this.AddClient(token, client);
        if (!pr){
            console.error('Error token expired');
            return client.close();
        } 
    }

    public async AddClient(token: string, client: Socket) {
        try {
            const user  = await this.authService.verifyTokenAndSetOnline(token);
            if (!user) return false;
            client['uuid'] = user['_id'].toString();
            // console.log(client['uuid']);
            // client.addListener()
            this.users.push(client);
            console.log(`Client connected, Total UsersConnected: ${this.users.length}`);
            return true;
        } catch (error) {
            return false;
        }
    }

    // method listen when client disconnected
    public async handleDisconnect(@ConnectedSocket() client: Socket) {
        // check if public api node
        await this.authService.disconnect(client['uuid']);
        this.users = this.users.filter(item => item['uuid'] !== client['uuid']);
        console.log(`Client Disconnected, Total UsersConnected: ${this.users.length}`);
    }



    //* =======================================================================================
    //*                                HANDLE EVENTS
    //* =======================================================================================

    @SubscribeMessage('user-message')
    public async handleEventCreateBand( @ConnectedSocket() client: Socket, @MessageBody() data: NewUserMessageDto ) {
        const { from, to, message } = data;
        
        const requestUserMessageDto =  new RequestUserMessageDto();
        requestUserMessageDto.event = 'user-message';
        requestUserMessageDto.from = from;
        requestUserMessageDto.to = to;
        requestUserMessageDto.message = message;
        //* save messages in db
        await this.messageService.saveMessage(requestUserMessageDto)
        //* send message to user
        const findClient = this.users.find(item => item['uuid'] === to);
        if (findClient) {
            // console.log('findClient', findClient['uuid']);
            findClient.send(JSON.stringify(requestUserMessageDto));
        }
        // return data;
    }


    //* =======================================================================================
    //*                                METHODS
    //* =======================================================================================


}