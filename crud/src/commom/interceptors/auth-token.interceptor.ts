import {
    BadRequestException,
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
    UnauthorizedException,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class AuthTokenInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const authToken: [bearer: string, token: string] =
            request.headers.authorization?.split(' ')

        if (!authToken) {
            throw new UnauthorizedException(
                'No authentication token was provided',
            )
        }

        const [bearer, _] = authToken

        if (bearer !== 'Bearer') {
            throw new BadRequestException('Authentication token must be Bearer')
        }

        // todo verify token

        return next.handle()
    }
}
