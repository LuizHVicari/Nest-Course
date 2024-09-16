import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
    database: {
        type: process.env.DB_TYPE as 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: Boolean(process.env.DB_AUTOLOAD_ENTITIES),
        synchronize: Boolean(process.env.DB_SYNCHRONIZE), // should not be true in prod
    },
    environment: process.env.NODE_ENV || 'development',
}))
