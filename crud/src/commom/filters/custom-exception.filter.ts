import {
    ArgumentsHost,
    NotFoundException,
    Catch,
    ExceptionFilter,
    Injectable,
} from '@nestjs/common'

// can be used to catch any kind of error and treat it as wished
@Injectable()
@Catch(NotFoundException)
export class CustomExceptionFilter<T extends NotFoundException>
    implements ExceptionFilter
{
    catch(exception: T, host: ArgumentsHost) {
        const context = host.switchToHttp()
        const response = context.getResponse()
        const request = context.getRequest()

        const statusCode = exception.getStatus()
        const exceptionResponse = exception.getResponse()

        const error =
            typeof response === 'string'
                ? {
                      message: exceptionResponse,
                  }
                : (exceptionResponse as object)

        response.status(statusCode).json({
            ...error,
            date: new Date().toISOString(),
            path: request.url,
        })
    }
}
