import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import jwtConfig from '../config/jwt.config';
import { REQUEST_TOKEN_PAYLOAD_KEY } from '../auth.constants';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  constructor (
    private readonly jwtService: JwtService,
    @Inject(jwtConfig.KEY)
    private readonly jwtSettings: ConfigType<typeof jwtConfig>
  ) {}

  async canActivate(
    context: ExecutionContext,
  ) {
    console.log('Entrei')
    const request: Request = context.switchToHttp().getRequest()
    const token = this.extractToken(request)

    if (!token) {
      throw new UnauthorizedException('Credentials were not provided')
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, this.jwtSettings)
      request[REQUEST_TOKEN_PAYLOAD_KEY] = payload
    } catch (error) {
      console.log(error)
      throw new UnauthorizedException('Falha ao logar')
    }

    return true
  }

  extractToken(request: Request): string | undefined {
    const authorization = request.headers?.authorization

    if (!authorization || typeof authorization !== 'string'){
      return undefined
    }

    const [bearer, token] =  authorization.split(' ')
    if (bearer !== 'Bearer') {
      return undefined
    }
    return token
  }
}
