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
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common'
import { MessagesService } from './messages.service'
import { Message } from './entities/message.entity'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { PaginationDto } from 'src/commom/dto/pagination.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard'
import { TokenPayloadParam } from 'src/auth/params/token-payload.param'
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto'

@Controller('messages')
@ApiTags('messages')
export class MessagesController {
    constructor(private readonly messagesService: MessagesService) {}

    @Get()
    listMessages(@Query() paginationDto: PaginationDto): Promise<Message[]> {
        const messages = this.messagesService.findAllMessages(paginationDto)
        return messages
    }

    @Post()
    @UseGuards(AuthTokenGuard)
    async createMessage(
        @Body() message: CreateMessageDto, 
        @TokenPayloadParam() tokenPayload: TokenPayloadDto
    ) {
        const created = await this.messagesService.createMessage(message, tokenPayload)
        if (!created) throw new BadRequestException()
        return created
    }

    @Get(':id')
    async retrieveMessage(
        @Param('id') id: number,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto
    ): Promise<Message> {
        const message = await this.messagesService.retrieveMessage(id)
        if (message) return message
        throw new NotFoundException()
    }

    @Patch(':id')
    @UseGuards(AuthTokenGuard)
    async partialUpdateMessage(
        @Body() body: UpdateMessageDto,
        @Param('id') id: number,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto
    ): Promise<Message> {
        const message = await this.messagesService.updateMessage(id, body, tokenPayload)
        if (!message) {
            throw new NotFoundException()
        }
        return message
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    @UseGuards(AuthTokenGuard)
    async destroyMessage(
        @Param('id') id: number,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto
    ) {
        const deleted = await this.messagesService.destroyMessage(id, tokenPayload)
        if (!deleted) {
            throw new NotFoundException()
        }
    }
}
