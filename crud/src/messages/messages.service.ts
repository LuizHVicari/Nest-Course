import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Message } from './entities/message.entity'
import { UpdateMessageDto } from './dto/update-message.dto'
import { CreateMessageDto } from './dto/create-message.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PeopleService } from 'src/people/people.service'
import { PaginationDto } from 'src/commom/dto/pagination.dto'
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto'

const returnItems = {
    relations: ['from', 'to'],
    select: {
        from: {
            id: true,
            name: true,
        },
        to: {
            id: true,
            name: true,
        },
    },
}

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
        private readonly peopleService: PeopleService,
        // private readonly configService: ConfigService
    ) {}

    async findAllMessages({
        limit,
        offset,
    }: PaginationDto): Promise<Message[]> {
        const messages = await this.messageRepository.find({
            ...returnItems,
            order: {
                id: 'asc',
            },
            take: limit, // how many items will be shown
            skip: offset, // first element to start showing
        })
        return messages
    }

    async retrieveMessage(id: number): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: {
                id,
            },
            ...returnItems,
        })
        if (message) return message
        throw new NotFoundException('Could not find message')
    }

    async createMessage(body: CreateMessageDto, tokenPayload: TokenPayloadDto) {
        const { toId } = body
        const from = await this.peopleService.findOne(tokenPayload.sub)
        const to = await this.peopleService.findOne(toId)

        const message = {
            from,
            to,
            text: body.text,
            read: false,
            date: new Date(),
        }
        const createdMessage = this.messageRepository.create(message)
        await this.messageRepository.save(createdMessage)

        return {
            ...createdMessage,
            from: {
                id: message.from.id,
                name: message.from.name,
            },
            to: {
                id: message.to.id,
                name: message.from.name,
            },
        }
    }

    async updateMessage(id: number, body: UpdateMessageDto, tokenPayload: TokenPayloadDto) {
        const message = await this.retrieveMessage(id)
        this.verifyUserToken(tokenPayload, message.from.id)
        message.text = body?.text ?? message.text
        message.read = body?.read ?? message.read
        return await this.messageRepository.save(message)
    }

    async destroyMessage(id: number, tokenPayload: TokenPayloadDto): Promise<boolean> {
        const message = await this.retrieveMessage(id)
        console.log(message)
        this.verifyUserToken(tokenPayload, message.from.id)
        if (!message) return false

        await this.messageRepository.remove(message)
        return true
    }

    verifyUserToken(tokenPayload: TokenPayloadDto, fromId: number) {
        if (tokenPayload.sub !== fromId) {
            throw new ForbiddenException('This message was sent from another user')
        }
    }
}
