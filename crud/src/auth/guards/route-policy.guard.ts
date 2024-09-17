import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Observable } from 'rxjs'
import { REQUEST_TOKEN_PAYLOAD_KEY, ROUTE_POLICY_KEY } from '../auth.constants'
import { RoutePolicies } from 'src/commom/enums/route-policies.enum'
import { Request } from 'express'
import { Person } from 'src/people/entities/person.entity'

@Injectable()
export class RoutePolicyGuard implements CanActivate {
    constructor (private readonly reflector: Reflector) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const policyRequired = this.reflector.get<RoutePolicies | undefined>(
            ROUTE_POLICY_KEY, 
            context.getHandler()
        )
        if (!policyRequired) {
            return true
        }

        const request: Request = context.switchToHttp().getRequest()
        const tokenPayload = request[REQUEST_TOKEN_PAYLOAD_KEY]

        if (!tokenPayload) {
            throw new UnauthorizedException('User is not logged in')
        }

        const { user } : {user: Person } = tokenPayload
        
        if (!user.policies.includes(policyRequired)) {
            throw new UnauthorizedException('User does not have permission to access this resource')
        }


        return true
    }
}
