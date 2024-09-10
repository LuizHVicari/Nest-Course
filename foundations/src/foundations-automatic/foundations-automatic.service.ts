import { Injectable } from '@nestjs/common';

@Injectable()
export class FoundationsAutomaticService {
    homeService(): string {
        return 'Automatic home'
    }

}
