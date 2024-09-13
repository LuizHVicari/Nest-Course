import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            // transform: true, // try to transform the data to the param type on the controller
        }),
    )
    const config = new DocumentBuilder()
        .setTitle('CRUD example')
        .setDescription('An app to practice CRUD operations using NestJs')
        .setVersion('1.0')
        .addOAuth2()
        .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('api', app, document)
    await app.listen(3000)
}
bootstrap()
