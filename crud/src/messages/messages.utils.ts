import { Injectable } from '@nestjs/common'

@Injectable() // any class decorated with @Injectable() can be used as a dependency for injection
export class MessageUtils {
    invertString(str: string) {
        return str.split('').reverse().join('')
    }
}

@Injectable()
export class MessageUtilsMock {
    invertString(str: string) {
        return str
    }
}
