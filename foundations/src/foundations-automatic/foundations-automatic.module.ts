import { Module } from '@nestjs/common';
import { FoundationsAutomaticController } from './foundations-automatic.controller';
import { FoundationsAutomaticService } from './foundations-automatic.service';

@Module({
  controllers: [FoundationsAutomaticController],
  providers: [FoundationsAutomaticService]
})
export class FoundationsAutomaticModule {}
