import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MessagesModule } from 'src/messages/messages.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigType } from '@nestjs/config'
import * as Joi from '@hapi/joi'
import { JoiValidationSchema } from 'src/objects/joi_validation_schema'
import appConfig from './app.config'

@Module({
    imports: [
        ConfigModule.forRoot({
            validationSchema: Joi.object({ JoiValidationSchema }),
            load: [appConfig],
        }),
        MessagesModule,
        // PeopleModule,
        // TypeOrmModule.forRoot({
        //     type: process.env.DB_TYPE as 'postgres',
        //     host: process.env.DB_HOST,
        //     port: +process.env.DB_PORT,
        //     username: process.env.DB_USERNAME,
        //     password: process.env.DB_PASSWORD,
        //     database: process.env.DB_NAME,
        //     autoLoadEntities: Boolean(process.env.DB_AUTOLOAD_ENTITIES),
        //     synchronize: Boolean(process.env.DB_SYNCHRONIZE), // should not be true in prod
        // }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule.forFeature(appConfig)],
            inject: [appConfig.KEY],
            useFactory: async (appSettings: ConfigType<typeof appConfig>) => {
                return {
                    type: appSettings.database.type,
                    host: appSettings.database.host,
                    port: appSettings.database.port,
                    username: appSettings.database.username,
                    password: appSettings.database.password,
                    database: appSettings.database.database,
                    autoLoadEntities: appSettings.database.autoLoadEntities,
                    synchronize: appSettings.database.synchronize, // should not be true in prod
                }
            },
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
//         consumer.apply(SimpleMiddleware).forRoutes('*')
//         consumer.apply(SimpleMiddleware).forRoutes({
//             path: '*',
//             method: RequestMethod.GET,
//         })
//     }
// }
export class AppModule {}
