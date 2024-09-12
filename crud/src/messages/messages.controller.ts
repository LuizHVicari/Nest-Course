import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
} from '@nestjs/common'
import { MessagesService } from './messages.service'
import { Message } from './entities/message.entity'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    listMessages(
        @Query() pagination: { limit: string; offset: string },
    ): Promise<Message[]> {
        const { limit = '10', offset = '0' } = pagination
        const messages = this.messagesService.findAllMessages()
        return messages
    }

    @Post()
    createMessage(@Body() message: CreateMessageDto) {
        const created = this.messagesService.createMessage(message)
        if (!created) throw new BadRequestException()
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    async retrieveMessage(@Param('id') id: number): Promise<Message> {
        const message = await this.messagesService.retrieveMessage(id)
        if (message) return message
        throw new NotFoundException()
    }

    @Patch(':id')
    async partialUpdateMessage(
        @Body() body: UpdateMessageDto,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Message> {
        const message = await this.messagesService.updateMessage(id, body)
        if (!message) {
            throw new NotFoundException()
        }
        return message
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async destroyMessage(@Param('id', ParseIntPipe) id: number) {
        const deleted = await this.messagesService.destroyMessage(id)
        if (!deleted) {
            throw new NotFoundException()
        }
    }
}
