import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';

@Module({
  providers: [PredictionsService],
  controllers: [PredictionsController]
})
export class PredictionsModule {}
