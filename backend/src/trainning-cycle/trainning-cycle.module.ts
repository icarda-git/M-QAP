import { Module } from '@nestjs/common';
import { TrainningCycleController } from './trainning-cycle.controller';
import { TrainingCycleService } from './trainning-cycle.service';
import { TrainingCycle } from 'src/entities/trainning-cycle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingCycle])],
  controllers: [TrainningCycleController],
  providers: [TrainingCycleService],
  exports:[TrainingCycleService]
})
export class TrainningCycleModule {}
