import { forwardRef, Module } from '@nestjs/common'
import { PeopleService } from './people.service'
import { PeopleController } from './people.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Person } from './entities/person.entity'
import { MessagesModule } from 'src/messages/messages.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Person]),
        forwardRef(() => MessagesModule), // resolve circular dependencies
    ],
    controllers: [PeopleController],
    providers: [PeopleService],
    exports: [PeopleService, TypeOrmModule.forFeature([Person])],
})
export class PeopleModule {}
