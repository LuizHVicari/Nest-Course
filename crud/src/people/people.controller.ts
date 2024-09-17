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
    Req,
} from '@nestjs/common'
import { PeopleService } from './people.service'
import { CreatePersonDto } from './dto/create-person.dto'
import { UpdatePersonDto } from './dto/update-person.dto'
import { ApiTags } from '@nestjs/swagger'
import { AuthTokenGuard } from 'src/auth/guards/auth-token.guard'
import { Request } from 'express'
import { REQUEST_TOKEN_PAYLOAD_KEY } from 'src/auth/auth.constants'

@Controller('people')
@ApiTags('people')
@UseGuards(AuthTokenGuard)
export class PeopleController {
    constructor(private readonly peopleService: PeopleService) {}

    @Post()
    create(@Body() createPersonDto: CreatePersonDto) {
        return this.peopleService.create(createPersonDto)
    }

    @Get()
    findAll(@Req() req: Request) {
        console.log(req[REQUEST_TOKEN_PAYLOAD_KEY])
        return this.peopleService.findAll()
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.peopleService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updatePersonDto: UpdatePersonDto) {
        return this.peopleService.update(+id, updatePersonDto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.peopleService.remove(+id)
    }
}
