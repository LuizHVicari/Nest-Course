import { Injectable } from '@nestjs/common'
import { MessageEntity } from './entities/message.entity'

@Injectable()
export class MessagesService {
    private lastId = 1
    private messages: MessageEntity[] = [{
        id: 1,
        text: 'first message',
        from: 'Joana',
        to: 'João',
        read: false,
        date: new Date()
    }]

    findAllMessages(): MessageEntity[] {
        return this.messages
    }


    retrieveMessage(id: string): MessageEntity {
        return this.messages.find(item => item.id === +id )
    }

    createMessage(body: MessageEntity): boolean {
        this.lastId += 1
        const id = this.lastId
        const message = {
            id,
            ...body
        }
        this.messages.push(message)
        console.log(message)
        return true
    }

    updateMessage(id: string, body: any): MessageEntity {
        const messageIdx = this.messages.findIndex(m => m.id === +id)
        
        if (messageIdx >= 0) {
            const message = this.messages[messageIdx]
            const newMessage = {
                id: message.id,
                ...body
            }
            this.messages[messageIdx] = newMessage
            return this.messages[messageIdx]
        }
    }

    destroyMessage(id: string): boolean {
        const messageIdx = this.messages.findIndex(m => m.id === +id)
        if (messageIdx >= 0) {
            this.messages.splice(messageIdx, 1)
            console.debug(this.messages)
            return true
        }
        return false
    }



}
