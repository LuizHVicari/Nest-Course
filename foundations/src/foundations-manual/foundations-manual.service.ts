import { Injectable } from "@nestjs/common";

@Injectable()
export class FoundationsManualService {
    homeService(): string {
        return 'Manual home'
    }
}