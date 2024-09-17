import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { LoginDto } from './dtos/login.dto'
import { Repository } from 'typeorm'
import { Person } from 'src/people/entities/person.entity'
import { HashingServiceProtocol } from './hashing/hasing.service'
import { Message } from 'src/messages/entities/message.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigType } from '@nestjs/config'
import appConfig from 'src/app/app.config'
import jwtConfig from './config/jwt.config'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor (
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        private readonly hashingService: HashingServiceProtocol,
        @Inject(jwtConfig.KEY)
        private readonly jwtSettings: ConfigType<typeof jwtConfig>,
        private readonly jwtService: JwtService
    ) {}
    
    async login(loginDto: LoginDto) {
        const person = await this.personRepository.findOneBy({ email: loginDto.email })
        let passwordHashValid = false

        if (person) {
            passwordHashValid = await this.hashingService.compare(loginDto.password, person.passwordHash)
        }

        if (!passwordHashValid){
            throw new UnauthorizedException('Invalid credentials')
        }

        const accessToken = await this.jwtService.signAsync({
            sub: person.id,
            email: person.email,
        },{
            audience: this.jwtSettings.audience,
            issuer: this.jwtSettings.issuer,
            secret: this.jwtSettings.secret,
            expiresIn: this.jwtSettings.jwtTtl
        })  

        return {accessToken}

        // todo create jwt token and return it to the user


    }
}
