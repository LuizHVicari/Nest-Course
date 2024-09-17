import {
    BadRequestException,
    ConflictException,
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { CreatePersonDto } from './dto/create-person.dto'
import { UpdatePersonDto } from './dto/update-person.dto'
import { Person } from './entities/person.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { HashingServiceProtocol } from 'src/auth/hashing/hasing.service'
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto'

@Injectable()
export class PeopleService {
    constructor(
        @InjectRepository(Person)
        private readonly personRepository: Repository<Person>,
        private readonly hashingService: HashingServiceProtocol,
    ) {}

    private async savePerson(person: Person) {
        try {
            return await this.personRepository.save(person)
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Email is already registered.')
            }
            throw error
        }
    }

    async create(createPersonDto: CreatePersonDto) {
        const passwordHash = await this.hashingService.hash(
            createPersonDto.password,
        )
        const personData = {
            name: createPersonDto.name,
            passwordHash,
            email: createPersonDto.email,
        }
        const person = this.personRepository.create(personData)
        if (!person) throw new BadRequestException('Could not create person')
        return await this.savePerson(person)
    }

    async findAll() {
        const people = await this.personRepository.find()
        return people
    }

    async findOne(id: number) {
        const person = await this.personRepository.findOneBy({ id })
        if (!person) throw new NotFoundException('Could not find person.')
        return person
    }

    async update(
        id: number,
        updatePersonDto: UpdatePersonDto,
        tokenPayload: TokenPayloadDto,
    ) {
        const personData = {
            name: updatePersonDto?.name,
        }

        if (updatePersonDto?.password) {
            const passwordHash = await this.hashingService.hash(
                updatePersonDto.password,
            )
            personData['passwordHash'] = passwordHash
        }
        const person = await this.personRepository.preload({
            id,
            ...personData,
        })
        if (!person) {
            throw new NotFoundException('Person could not be found')
        }
        this.verifyUserToken(tokenPayload, person.id)

        return this.personRepository.save(person)
    }

    async remove(id: number, tokenPayload: TokenPayloadDto) {
        const person = await this.findOne(id)
        this.verifyUserToken(tokenPayload, person.id)

        return await this.personRepository.remove(person)
    }

    verifyUserToken(tokenPayload: TokenPayloadDto, id: number) {
        if (id !== tokenPayload.sub) {
            throw new ForbiddenException(
                'The user is not allowed to alter another user data.',
            )
        }
    }
}
