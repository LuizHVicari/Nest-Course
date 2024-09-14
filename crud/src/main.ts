import { NestFactory } from '@nestjs/core'
import { AppModule } from './app/app.module'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ParseIntIdPipe } from './commom/pipes/parse-int-id.pipe'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            // transform: true, // try to transform the data to the param type on the controller
        }),
        new ParseIntIdPipe(),
    )
    // this way does not allow dependency injection, another implementation that allows it can be found in src/app/app.module.ts
    // app.useGlobalGuards(new IsAdminGuard())
    // app.useGlobalFilters(new CustomExceptionFilter()) // adding a global filter
    // app.use(new SimpleMiddleware().use) // adding a global middleware

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
