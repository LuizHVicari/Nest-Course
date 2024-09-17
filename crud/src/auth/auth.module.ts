import { Global, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { HashingServiceProtocol } from './hashing/hasing.service'
import { BCryptService } from './hashing/bcrypt.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Person } from 'src/people/entities/person.entity'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import jwtConfig from './config/jwt.config'

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([Person]),
        ConfigModule.forFeature(jwtConfig),
        JwtModule.registerAsync(jwtConfig.asProvider()),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        {
            provide: HashingServiceProtocol,
            useClass: BCryptService,
        },
    ],
    exports: [
        HashingServiceProtocol,
        JwtModule,
        ConfigModule.forFeature(jwtConfig),
    ],
})
export class AuthModule {}
