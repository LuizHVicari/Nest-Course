// client (browser) -> middleware (request, response) -> Nest (interceptors, pipes, guards, filters...)
// the middleware access the raw request (usually with ExpressJS)
// one middleware can call each other before getting into the server
// very similar to an interceptor, but can act either as a pipe, guard, etc

import { NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

export class SimpleMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        req['newParam'] = {
            title: 'This is a new custom param',
        }

        req['user'] = {
            user: 'super_user',
            role: 'admin',
        }
        next()

        res.on('close', () => {
            console.log('Connections finnished')
        })
    }
}
