import {  Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AI } from './ai/ai.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DoiService } from './doi/doi.service';
import { FormatSearvice } from './handle/formater.service';
import { HandleService } from './handle/handle.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, DoiService, AI, HandleService,FormatSearvice],
})
export class AppModule {}
