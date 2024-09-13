import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

export class TimingConnectionInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
        const start = Date.now()
        return next.handle().pipe(tap(() => {
            const end = Date.now()
            const elapsed = end - start
            console.debug(`Method took ${elapsed} ms to execute`)}
        )).pipe(tap((data) => console.debug(data)))
    }
}