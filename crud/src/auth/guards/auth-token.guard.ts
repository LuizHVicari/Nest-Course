import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common'
import { ConfigType } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'
import jwtConfig from '../config/jwt.config'
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants'
import { Repository } from 'typeorm'
import { Person } from 'src/people/entities/person.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuthTokenGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        @Inject(jwtConfig.KEY)
        private readonly jwtSettings: ConfigType<typeof jwtConfig>,
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
    ) {}

    async canActivate(context: ExecutionContext) {
        const request: Request = context.switchToHttp().getRequest()
        const token = this.extractToken(request)

        if (!token) {
            throw new UnauthorizedException('Credentials were not provided')
        }

        try {
            const payload = await this.jwtService.verifyAsync(
                token,
                this.jwtSettings,
            )
            const user = await this.personRepository.findOneBy({
                id: payload.sub,
                active: true,
            })

            if (!user) {
                throw new UnauthorizedException('Person not found')
            }

            payload['user'] = user
            request[REQUEST_TOKEN_PAYLOAD_KEY] = payload
        } catch (error) {
            throw new UnauthorizedException('Failed to Log in' + error)
        }

        return true
    }

    extractToken(request: Request): string | undefined {
        const authorization = request.headers?.authorization

        if (!authorization || typeof authorization !== 'string') {
            return undefined
        }

        const [bearer, token] = authorization.split(' ')
        if (bearer !== 'Bearer') {
            return undefined
        }
        return token
    }
}
