import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MessagesModule } from 'src/messages/messages.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PeopleModule } from 'src/people/people.module'

@Module({
    imports: [
        MessagesModule,
        PeopleModule,
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'crud',
            autoLoadEntities: true,
            synchronize: true, // should not be used in prod
        }),
    ],
    controllers: [AppController],
    providers: [
        AppService,
        // {
        //     provide: APP_FILTER,
        //     useClass: CustomExceptionFilter,
        // },
        // {
        //     provide: APP_GUARD,
        //     useClass: IsAdminGuard,
        // },
    ],
})
// export class AppModule implements NestModule {
//     configure(consumer: MiddlewareConsumer) {
//         // consumer.apply(SimpleMiddleware).forRoutes('*')
//         consumer.apply(SimpleMiddleware).forRoutes({
//             path: '*',
//             method: RequestMethod.GET,
//         })
//     }
// }
export class AppModule {}
