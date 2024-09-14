import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
} from '@nestjs/common'
import { Observable, of, tap } from 'rxjs'

@Injectable()
export class SimpleCacheInterceptor implements NestInterceptor {
    private readonly cache = new Map()

    intercept(
        context: ExecutionContext,
        next: CallHandler<any>,
    ): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest()
        const url = request.url
        const method = request.method

        if (method !== 'GET') {
            return next.handle()
        }

        if (this.cache.has(url)) {
            return of(this.cache.get(url))
        }

        return next.handle().pipe(
            tap(data => {
                this.cache.set(url, data)
            }),
        )
    }
}
