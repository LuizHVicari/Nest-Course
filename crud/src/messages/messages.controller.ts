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
import { MessageEntity } from './entities/message.entity'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    listMessages(
        @Query() pagination: { limit: string; offset: string },
    ): MessageEntity[] {
        const { limit = '10', offset = '0' } = pagination
        const messages = this.messagesService.findAllMessages()
        console.debug(messages)
        return messages
    }

    @Post()
    createMessage(@Body() message: CreateMessageDto) {
        const created = this.messagesService.createMessage(message)
        if (!created) throw new BadRequestException()
    }

    @HttpCode(HttpStatus.OK)
    @Get(':id')
    retrieveMessage(@Param('id') id: number): MessageEntity {
        const message = this.messagesService.retrieveMessage(id)
        if (message !== undefined) {
            return message
        }
        throw new NotFoundException()
    }

    @Patch(':id')
    partialUpdateMessage(
        @Body() body: UpdateMessageDto,
        @Param('id', ParseIntPipe) id: number,
    ): MessageEntity {
        const message = this.messagesService.updateMessage(id, body)
        if (message === undefined) {
            throw new NotFoundException()
        }
        return message
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    destroyMessage(@Param('id', ParseIntPipe) id: number) {
        const deleted = this.messagesService.destroyMessage(id)
        if (!deleted) {
            throw new NotFoundException()
        }
    }
}
