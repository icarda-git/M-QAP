import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AI } from './ai/ai.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoiService } from './doi/doi.service';

@Module({
  imports: [HttpModule,ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, DoiService,AI],
})
export class AppModule {}
