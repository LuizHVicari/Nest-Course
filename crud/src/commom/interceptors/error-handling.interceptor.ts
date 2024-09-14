import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'

import { catchError, Observable, throwError } from 'rxjs'

@Injectable()
export class ErrorHandlingInterceptor implements NestInterceptor {
    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        return next.handle().pipe(
            catchError(error => {
                // can be used to change the error code for example
                // return throwError(() => {
                //     if (error.name === 'NotFoundException') {
                //         return new BadRequestException(error.message)
                //     }
                // })
                return throwError(() => error)
            }),
        )
    }
}
