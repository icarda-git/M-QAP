import { HttpModule, Module } from '@nestjs/common';
import { AI } from './ai/ai.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoiService } from './doi/doi.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [AppService, DoiService,AI],
})
export class AppModule {}
