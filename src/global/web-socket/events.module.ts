import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { MessagesModule } from 'src/messages/messages.module';
import { UsersModule } from 'src/users/users.module';
import { EventsGateway } from './events.gateway';

@Module({
    imports:[
        AuthModule,
        UsersModule,
        MessagesModule
    ],
    providers: [EventsGateway],
})
export class EventsModule {}