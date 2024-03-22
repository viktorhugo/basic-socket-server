import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from 'src/schemas/schemas';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Message.name, schema: MessageSchema },
      ]
    )
  ],
  providers: [MessageService],
  controllers: [MessageController],
  exports: [MessageService]
})
export class MessagesModule {}
