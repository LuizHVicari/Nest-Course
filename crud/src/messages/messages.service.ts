import { Injectable } from '@nestjs/common'
import { Message } from './entities/message.entity'
import { UpdateMessageDto } from './dto/update-message.dto'
import { CreateMessageDto } from './dto/create-message.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private readonly messageRepository: Repository<Message>,
    ) {}

    async findAllMessages(): Promise<Message[]> {
        const messages = await this.messageRepository.find()
        return messages
    }

    async retrieveMessage(id: number): Promise<Message> {
        const message = await this.messageRepository.findOne({
            where: {
                id,
            },
        })
        if (message) return message
    }

    async createMessage(body: CreateMessageDto): Promise<Message> {
        const message = {
            ...body,
            read: false,
            date: new Date(),
        }
        const createdMessage = this.messageRepository.create(message)
        return this.messageRepository.save(createdMessage)
    }

    async updateMessage(
        id: number,
        body: UpdateMessageDto,
    ): Promise<Message> {
        const partialUpdateMessageDto = {
            read: body?.read,
            text: body.text,
        }
        const message = await this.messageRepository.preload({
            id,
            ...partialUpdateMessageDto,
        })
        if (!message) {
            return null
        }
        return await this.messageRepository.save(message)
    }

    async destroyMessage(id: number): Promise<boolean> {
        const message = await this.messageRepository.findOneBy({ id })
        if (!message) return false

        await this.messageRepository.remove(message)
        return true
    }
}
