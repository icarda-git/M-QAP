import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AI } from '../AI/ai.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private ai: AI) {}
  @Cron('45 * * * * *')
  handleCron() {
   // this.logger.debug('Called when the current second is 45');
   // this.ai.startTraning();
  }
}