import { IsEmail } from 'class-validator'
import { Message } from 'src/messages/entities/message.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number
    @Column({ unique: true })
    @IsEmail()
    email: string
    @Column({ length: 255 })
    passwordHash: string // will be Hashed
    @Column({ length: 100 })
    name: string

    @OneToMany(() => Message, message => message.from)
    messagesSent: Message

    @OneToMany(() => Message, message => message.to)
    messagesReceived: Message

    @CreateDateColumn()
    createdAt: Date
    @UpdateDateColumn()
    updatedAt: Date
}
