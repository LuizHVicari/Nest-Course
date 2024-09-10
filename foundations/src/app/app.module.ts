import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FoundationsManualModule } from 'src/foundations-manual/foundations-manual.module';
import { FoundationsAutomaticModule } from 'src/foundations-automatic/foundations-automatic.module';

@Module({
    imports: [FoundationsManualModule, FoundationsAutomaticModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
