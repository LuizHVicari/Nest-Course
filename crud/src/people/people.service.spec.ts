import { PeopleService } from './people.service'
import { Repository } from 'typeorm'
import { Person } from './entities/person.entity'
import { HashingServiceProtocol } from 'src/auth/hashing/hasing.service'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm'
import { CreatePersonDto } from './dto/create-person.dto'
import { ConflictException, NotFoundException } from '@nestjs/common'
import { UpdatePersonDto } from './dto/update-person.dto'

describe('People Service', () => {
    let personService: PeopleService
    let personRepository: Repository<Person>
    let hashingService: HashingServiceProtocol

    const email = 'email@example.com'
    const name = 'Name'
    const createPersonDto: CreatePersonDto = {
        email,
        name,
        password: '123456',
    }
    const passwordHash = 'password_hash'
    const newPerson = {
        id: 1,
        email,
        name,
        passwordHash,
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PeopleService,
                {
                    provide: getRepositoryToken(Person),
                    useValue: {
                        create: jest.fn(),
                        save: jest.fn(),
                        findOneBy: jest.fn(),
                        find: jest.fn(),
                        preload: jest.fn()
                    },
                },
                {
                    provide: HashingServiceProtocol,
                    useValue: {
                        hash: jest.fn(),
                    },
                },
            ],
        }).compile()

        personService = module.get<PeopleService>(PeopleService)
        personRepository = module.get<Repository<Person>>(
            getRepositoryToken(Person),
        )
        hashingService = module.get<HashingServiceProtocol>(
            HashingServiceProtocol,
        )
    })

    describe('Dependencies are defined', () => {
        test('whether personService is defined', () => {
            expect(personService).toBeDefined()
        })

        test('whether personRepository is defined', () => {
            expect(personRepository).toBeDefined()
        })

        test('whether hashingService is defined', () => {
            expect(hashingService).toBeDefined()
        })
    })

    describe('Create', () => {
        it('should create a new person', async () => {
            jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash)
            jest.spyOn(personRepository, 'create').mockReturnValue(
                newPerson as any,
            )
            jest.spyOn(personRepository, 'save').mockResolvedValue(
                newPerson as any,
            )

            const result = await personService.create(createPersonDto)

            expect(hashingService.hash).toHaveBeenCalledWith(
                createPersonDto.password,
            )
            expect(personRepository.save).toHaveBeenCalledWith(newPerson)
            expect(result).toEqual(newPerson)
        })

        it('should raise a conflict exception error when the e-mail already exists', async () => {
            jest.spyOn(personRepository, 'save').mockRejectedValue({
                code: '23505',
            })
            jest.spyOn(personRepository, 'create').mockReturnValue(
                newPerson as any,
            )

            await expect(personService.create(createPersonDto)).rejects.toThrow(
                ConflictException,
            )
        })

        it('should raise a generic exception', async () => {
            jest.spyOn(personRepository, 'save').mockRejectedValue(
                new Error('generic error'),
            )
            jest.spyOn(personRepository, 'create').mockReturnValue(
                newPerson as any,
            )

            await expect(personService.create(createPersonDto)).rejects.toThrow(
                new Error('generic error'),
            )
        })
    })

    describe('retrieve', () => {
        it('should return a person if found', async () => {
            const personFound = newPerson
            const personId = personFound.id

            jest.spyOn(personRepository, 'findOneBy').mockResolvedValue(
                personFound as any,
            )

            const result = await personService.findOne(personId)

            expect(result).toEqual(personFound)
        })

        it('should throw a 404 error if no person is found', async () => {
            await expect(personService.findOne({} as any)).rejects.toThrow(
                NotFoundException,
            )
        })
    })

    describe('list',() => {

        it('should return all people in the database', async () => {
            const peopleMock: Person[] = [
                newPerson as Person, {} as Person
            ]
    
            jest.spyOn(personRepository, 'find').mockResolvedValue(peopleMock)
    
            const result = await personService.findAll()
    
            expect(result).toEqual(peopleMock)
            expect(result[0]).toEqual(newPerson)
        })
    })

    describe('update', () => {

        it('should update a person', async () => {
            const personId = 1
            const updatePersonDto: UpdatePersonDto = {
                name: 'New name',
                password: '123456',
            }
            const tokenPayload = { sub: personId }
            const updatedPerson = {
                id: personId,
                name: 'New name',
                passwordHash
            }
    
            jest.spyOn(hashingService, 'hash').mockResolvedValue(passwordHash)
            jest.spyOn(personRepository, 'preload').mockResolvedValue(updatedPerson as any)
            jest.spyOn(personRepository, 'save').mockResolvedValue(updatedPerson as any)

            const result = await personService.update(personId, updatePersonDto, tokenPayload as any)
            expect(result).toEqual(updatedPerson)
            expect(hashingService.hash).toHaveBeenCalledWith(updatePersonDto.password)
            expect(personRepository.preload).toHaveBeenCalledWith({
                id: personId,
                name: updatePersonDto.name, 
                passwordHash
            })
            expect(personRepository.save).toHaveBeenCalledWith(updatedPerson)
        })

    })
})
