import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prediction } from 'src/entities/predictions.entity';
import { TrainingCycleModule } from 'src/training-cycle/training-cycle.module';

@Module({
  imports: [TypeOrmModule.forFeature([Prediction]), TrainingCycleModule],
  providers: [PredictionsService],
  controllers: [PredictionsController],
  exports: [PredictionsService],
})
export class PredictionsModule {}
