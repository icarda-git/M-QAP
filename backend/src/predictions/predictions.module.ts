import { Module } from '@nestjs/common';
import { PredictionsService } from './predictions.service';
import { PredictionsController } from './predictions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Predictions } from 'src/entities/predictions.entity';
import { TrainingCycleModule } from 'src/training-cycle/training-cycle.module';

@Module({
  imports: [TypeOrmModule.forFeature([Predictions]), TrainingCycleModule],
  providers: [PredictionsService],
  controllers: [PredictionsController],
  exports: [PredictionsService],
})
export class PredictionsModule {}
