import { Module } from '@nestjs/common';
import { TrainningCycleController } from './trainning-cycle.controller';
import { TrainningCycleService } from './trainning-cycle.service';
import { TrainningCycle } from 'src/entities/trainning-cycle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TrainningCycle])],
  controllers: [TrainningCycleController],
  providers: [TrainningCycleService],
})
export class TrainningCycleModule {}
