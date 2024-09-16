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
    UseInterceptors,
} from '@nestjs/common'
import { MessagesService } from './messages.service'
import { Message } from './entities/message.entity'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'
import { PaginationDto } from 'src/commom/dto/pagination.dto'
import { ApiTags } from '@nestjs/swagger'
import { TimingConnectionInterceptor } from 'src/commom/interceptors/timing-connection.interceptor'

@Controller('messages')
@ApiTags('messages')
// @UseInterceptors(
//     AddHeaderInterceptor,
//     ErrorHandlingInterceptor,
//     SimpleCacheInterceptor,
//     ChangeDataInterceptor,
//     AuthTokenInterceptor,
// ) // can be used either in the controller, method or globally
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        // private readonly messageUtils: MessageUtils,
        // @Inject('SERVER_NAME')
        // private readonly serverName: string
        // private readonly regexProtocol: RegexProtocol
        // @Inject(REMOVE_SPACES_REGEX)
        // private readonly removeSpacesRegex: RegexProtocol
    ) {}

    @Get()
    @UseInterceptors(TimingConnectionInterceptor)
    listMessages(@Query() paginationDto: PaginationDto): Promise<Message[]> {
        // console.log(this.messageUtils.invertString('teste'))
        // console.log(this.serverName)
        // console.debug(this.regexProtocol.execute('Teste Teste'))
        // console.debug(this.removeSpacesRegex.execute('teste teste'))
        const messages = this.messagesService.findAllMessages(paginationDto)
        return messages
    }

    @Post()
    async createMessage(@Body() message: CreateMessageDto) {
        const created = await this.messagesService.createMessage(message)
        if (!created) throw new BadRequestException()
        return created
    }

    @Get(':id')
    async retrieveMessage(@Param('id') id: number): Promise<Message> {
        const message = await this.messagesService.retrieveMessage(id)
        if (message) return message
        throw new NotFoundException()
    }

    @Patch(':id')
    async partialUpdateMessage(
        @Body() body: UpdateMessageDto,
        @Param('id') id: number,
    ): Promise<Message> {
        const message = await this.messagesService.updateMessage(id, body)
        if (!message) {
            throw new NotFoundException()
        }
        return message
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async destroyMessage(@Param('id') id: number) {
        const deleted = await this.messagesService.destroyMessage(id)
        if (!deleted) {
            throw new NotFoundException()
        }
    }
}
