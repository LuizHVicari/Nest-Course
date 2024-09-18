import { SetMetadata } from '@nestjs/common'
import { ROUTE_POLICY_KEY } from 'src/auth/auth.constants'
import { RoutePolicies } from '../enums/route-policies.enum'

export const SetRoutePolicy = (policy: RoutePolicies) => {
    return SetMetadata(ROUTE_POLICY_KEY, policy)
}
