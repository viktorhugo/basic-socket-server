import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RequestUserMessageDto } from 'src/auth/dto/auth.dto';
import { Message } from 'src/schemas/message.schema';
import { RequestConversationMessageDto } from '../dto/message.dto';

@Injectable()
export class MessageService {

    constructor(
        @InjectModel(Message.name)
        private readonly messageRepository: Model<Message>,
    ) {}


    public async saveMessage(message: RequestUserMessageDto) {
        try {
            const newMessage = new Message();
            newMessage.from = new Types.ObjectId(message.from) ;
            newMessage.to = new Types.ObjectId(message.to);
            newMessage.message = message.message;
            await this.messageRepository.create(message)
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    public async getConversationMessages(message: RequestConversationMessageDto) {
        try {
            const {from, skip, to} = message;
            const messages = await this.messageRepository
                .find({ 
                    $or: [ 
                        {from , to},
                        {from: to , to:from},
                    ]       
                })
                // .sort('-createdAt') //* el minus es para DESC O ASC
                .sort({ createdAt: 'desc' })
                .skip(skip)
                .limit(30)

            return { ok: true, msg: messages};
        } catch (error) {
            console.log(error);
            return { ok: false, msg: null};
        }
    }
}
