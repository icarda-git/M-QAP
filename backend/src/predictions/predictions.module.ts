import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Predictions } from 'src/entities/predictions.entity';
import { TrainningCycleModule } from 'src/trainning-cycle/trainning-cycle.module';

@Module({
  imports: [TypeOrmModule.forFeature([Predictions]),TrainningCycleModule],
  providers: [PredictionsService],
  controllers: [PredictionsController],
  exports:[PredictionsService]
})
export class PredictionsModule {}
