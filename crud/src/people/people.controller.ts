import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common'
import { PeopleService } from './people.service'
import { CreatePersonDto } from './dto/create-person.dto'
import { UpdatePersonDto } from './dto/update-person.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard'
import { TokenPayloadParam } from 'src/auth/params/token-payload.param'
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto'

@Controller('people')
@ApiTags('people')
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) {}

    @Post()
    create(@Body() createPersonDto: CreatePersonDto) {
        return this.peopleService.create(createPersonDto)
    }

    @Get()
    @UseGuards(AuthTokenGuard)
    findAll() {
        return this.peopleService.findAll()
    }

    @Get(':id')
    @UseGuards(AuthTokenGuard)
    findOne(@Param('id') id: string) {
        return this.peopleService.findOne(+id)
    }

    @Patch(':id')
    @UseGuards(AuthTokenGuard)
    update(
        @Param('id') id: string,
        @Body() updatePersonDto: UpdatePersonDto,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    ) {
        return this.peopleService.update(+id, updatePersonDto, tokenPayload)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    @UseGuards(AuthTokenGuard)
    remove(
        @Param('id') id: string,
        @TokenPayloadParam() tokenPayload: TokenPayloadDto,
    ) {
        return this.peopleService.remove(+id, tokenPayload)
    }
}
