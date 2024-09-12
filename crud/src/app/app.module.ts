import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MessagesModule } from 'src/messages/messages.module'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
    imports: [
        MessagesModule, 
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'crud',
            autoLoadEntities: true,
            synchronize: true, // should not be used in prod
        })
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
