import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto } from './dtos/login.dto'
import { Repository } from 'typeorm'
import { Person } from 'src/people/entities/person.entity'
import { HashingServiceProtocol } from './hashing/hasing.service'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigType } from '@nestjs/config'
import jwtConfig from './config/jwt.config'
import { JwtService } from '@nestjs/jwt'
import { RefreshTokenDto } from './dtos/refresh-token.dto'

@Injectable()
export class AuthService {
    
    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        private readonly hashingService: HashingServiceProtocol,
        @Inject(jwtConfig.KEY)
        private readonly jwtSettings: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService,
    ) {}

    async login(loginDto: LoginDto) {
        const person = await this.personRepository.findOneBy({
            email: loginDto.email,
            active: true
        })

        let passwordHashValid = false

        if (person) {
            passwordHashValid = await this.hashingService.compare(
                loginDto.password,
                person.passwordHash
            )
        }

        if (!passwordHashValid) {
            throw new UnauthorizedException('Invalid credentials')
        }

        const accessTokenPromise = this.getAcessToken(person)
        const refreshTokenPromise = this.signTokenAsync(
            person.id,
            this.jwtSettings.jwtRefreshTtl
        )

        const [accessToken, refreshToken] = await Promise.all([
            accessTokenPromise, 
            refreshTokenPromise
        ])

        return { accessToken, refreshToken }
    }

    async refreshTokens(refreshTokenDto: RefreshTokenDto) {
        try {
            const { sub } = await this.jwtService.verifyAsync(
                refreshTokenDto.refreshToken,
                this.jwtSettings
            )
            const user = await this.personRepository.findOneBy({
                id: sub,
                active: true
            })
            if (!user) {
                throw new Error('User is either not authorized or inactive')
            }

            return { accessToken: await this.getAcessToken(user) }

        } catch (error) {
            throw new UnauthorizedException('Refresh token is invalid')
        }
        
    }

    private async signTokenAsync<T>(
        sub: number, 
        payload?: T,  
        expiresIn: number = 3600
    ) {
        return await this.jwtService.signAsync({
            sub: sub,
            ...payload
        }, {
            audience: this.jwtSettings.audience,
            issuer: this.jwtSettings.issuer,
            secret: this.jwtSettings.secret,
            expiresIn,
        })
    }

    private async getAcessToken(person: Person) {
        return await this.signTokenAsync<Partial<Person>>(
            person.id,
            { email: person.email },
            this.jwtSettings.jwtTtl
        )
    }

   
}
