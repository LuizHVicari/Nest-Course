import { Injectable } from '@nestjs/common'
import { HashingServiceProtocol } from './hasing.service'
import * as bcrypt from 'bcrypt'

@Injectable()
export class BCryptService extends HashingServiceProtocol {
    async hash(password: string): Promise<string> {
        const salt = await bcrypt.genSalt()
        return await bcrypt.hash(password, salt)
    }

    async compare(password: string, passwordHash: string): Promise<boolean> {
        return await bcrypt.compare(password, passwordHash)
    }
}
