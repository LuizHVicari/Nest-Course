import { Injectable } from '@nestjs/common'
import { MessageEntity } from './entities/message.entity'
import { UpdateMessageDto } from './dto/update-message.dto'
import { CreateMessageDto } from './dto/create-message.dto'

@Injectable()
export class MessagesService {
    private lastId = 1
    private messages: MessageEntity[] = [
        {
            id: 1,
            text: 'first message',
            from: 'Joana',
            to: 'João',
            read: false,
            date: new Date(),
        },
    ]

    findAllMessages(): MessageEntity[] {
        return this.messages
    }

    retrieveMessage(id: number): MessageEntity {
        console.log(id, typeof id)
        return this.messages.find(item => item.id === id)
    }

    createMessage(body: CreateMessageDto): boolean {
        this.lastId += 1
        const id = this.lastId
        const message = {
            id,
            ...body,
            read: false,
            date: new Date(),
        }
        this.messages.push(message)
        console.log(message)
        return true
    }

    updateMessage(id: number, body: UpdateMessageDto): MessageEntity {
        const messageIdx = this.messages.findIndex(m => m.id === +id)

        if (messageIdx >= 0) {
            const message = this.messages[messageIdx]
            const newMessage = {
                ...message,
                ...body,
            }
            this.messages[messageIdx] = newMessage
            return this.messages[messageIdx]
        }
    }

    destroyMessage(id: number): boolean {
        const messageIdx = this.messages.findIndex(m => m.id === +id)
        if (messageIdx >= 0) {
            this.messages.splice(messageIdx, 1)
            console.debug(this.messages)
            return true
        }
        return false
    }
}
