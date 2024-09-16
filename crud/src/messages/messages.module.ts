import { Module } from '@nestjs/common'
import { MessagesController } from './messages.controller'
import { MessagesService } from './messages.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Message } from './entities/message.entity'
import { PeopleModule } from 'src/people/people.module'
import { MessageUtils, MessageUtilsMock } from './messages.utils'
import { RegexProtocol } from 'src/commom/regex/regex.protocol'
import { RemoveSpacesRegex } from 'src/commom/regex/remove-spaces.regex'
import { OnlyLowercaseLettersRegex } from 'src/commom/regex/only-lowercase.regex'
import { ONLY_LOWERCASE_LETTERS_REGEX, REMOVE_SPACES_REGEX } from './message.constants'
import { CustomDynamicModule } from 'src/custom-dynamic/custom-dynamic.module'
import { ConfigModule } from '@nestjs/config'

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Message]), 
        PeopleModule,
        CustomDynamicModule.register({
            apiKey: 'apikey',
            apiUrl: 'http://apiurl.com'
        })
    ],
    controllers: [MessagesController],
    providers: [
        MessagesService, {
            provide: MessageUtils,
            useClass: MessageUtils
        },{
            provide: ONLY_LOWERCASE_LETTERS_REGEX,
            useClass: OnlyLowercaseLettersRegex
        }, {
            provide: REMOVE_SPACES_REGEX,
            useClass: RemoveSpacesRegex
        },
        // {
        //     provide: RegexProtocol, // would be the interface that the controller (or any other file) will receive
        //     useClass: false /* this could be any boolean condition*/ ?  RemoveSpacesRegex : OnlyLowercaseLettersRegex // the class that will be implemented when calling the interface
        // }
            // useValue: new MessageUtilsMock(), // value that will be used when testing
        // }, {
        //      provide: 'SERVER_NAME',
        //      useValue: 'My name is NestJS'
        // }
    ],
})
export class MessagesModule {}
