import { Module } from '@nestjs/common';
import { FoundationManualController } from './foundations-manual.controller';
import { FoundationsManualService } from './foundations-manual.service';

@Module({
    controllers: [FoundationManualController],
	providers: [FoundationsManualService]
})
export class FoundationsManualModule {}
