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
import { PaginationDto } from 'src/commom/dto/pagination.dto'

@Controller('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    listMessages(
        @Query() paginationDto: PaginationDto,
    ): Promise<Message[]> {
        const messages = this.messagesService.findAllMessages(paginationDto)
        return messages
    }

    @Post()
    async createMessage(@Body() message: CreateMessageDto) {
        const created = await this.messagesService.createMessage(message)
        if (!created) throw new BadRequestException()
        return created
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
