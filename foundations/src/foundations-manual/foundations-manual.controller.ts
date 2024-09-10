import { Controller, Get } from '@nestjs/common';
import { FoundationsManualService } from './foundations-manual.service';

@Controller('foundations-manual')
export class FoundationManualController {
    constructor(
        private readonly foundationsManualService: FoundationsManualService
    ) {}

	@Get()
    manualControllerGet(): string {
        return this.foundationsManualService.homeService();
    }
}
