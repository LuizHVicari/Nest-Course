import { Controller, Get } from '@nestjs/common';
import { FoundationsAutomaticService } from './foundations-automatic.service';

@Controller('foundations-automatic')
export class FoundationsAutomaticController {
    constructor (
        private readonly foundationsAutomaticService: FoundationsAutomaticService
    ) {}

    @Get()
    automaticControllerGet(): string {
        return this.foundationsAutomaticService.homeService();
    }
}
