import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class IsAdminGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        const userRole = request['user']?.role
        if (userRole !== 'admin') {
            throw new ForbiddenException(
                'User should be an admin to use this resource',
            )
        }
        return true
    }
}
