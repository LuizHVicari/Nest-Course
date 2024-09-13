import { Person } from 'src/people/entities/person.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Message {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    text: string
    @Column({ default: false })
    read: boolean
    @Column()
    date: Date

    @ManyToOne(() => Person, { onDelete: 'CASCADE' }) // many messages can be send from one person
    @JoinColumn({ name: 'from' }) // column that holds the id of the person that sent the message
    from: Person
    @ManyToOne(() => Person, { onDelete: 'CASCADE' }) // one person can receive many messages
    @JoinColumn({ name: 'to' }) // column that holds the id of the person that received the message
    to: Person

    @CreateDateColumn()
    createdAt?: Date
    @UpdateDateColumn()
    updatedAt?: Date
}
