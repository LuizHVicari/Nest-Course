import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dtos/login.dto'
import { RefreshTokenDto } from './dtos/refresh-token.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto)
    }

    @Post('refresh')
    async refreshTokens(@Body() refreshToken: RefreshTokenDto) {
        return this.authService.refreshTokens(refreshToken)
    }
}
