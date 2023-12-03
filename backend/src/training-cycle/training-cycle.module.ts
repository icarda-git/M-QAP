import { Module } from '@nestjs/common';
import { TrainingCycleService } from './training-cycle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingCycle } from 'src/entities/training-cycle.entity';
import { TrainingCycleController } from './training-cycle.controller';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingCycle])],
  controllers: [TrainingCycleController],
  providers: [TrainingCycleService],
  exports:[TrainingCycleService]
})
export class TrainingCycleModule {}
