import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { MessagesModule } from 'src/messages/messages.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigType } from '@nestjs/config'
import * as Joi from '@hapi/joi'
import { JoiValidationSchema } from 'src/objects/joi_validation_schema'
import appConfig from './app.config'
import { AuthModule } from 'src/auth/auth.module'

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({
            validationSchema: Joi.object({ JoiValidationSchema }),
            load: [appConfig],
        }),
        MessagesModule,
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
    providers: [AppService],
})
export class AppModule {}
