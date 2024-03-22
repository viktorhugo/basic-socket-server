import { Body, Controller, Post } from '@nestjs/common';
import { RequestConversationMessageDto } from '../dto/message.dto';
import { MessageService } from '../services/message.service';

@Controller('messages')
export class MessageController {
    
    constructor(
        private readonly messageService: MessageService,
    ) {}

    
    @Post('get-conversations')
    async newUser( @Body() data: RequestConversationMessageDto) {
        return await this.messageService.getConversationMessages(data);
    }

}
