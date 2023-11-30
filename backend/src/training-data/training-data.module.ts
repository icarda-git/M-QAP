import { Module } from '@nestjs/common';
import { TrainingDataController } from './training-data.controller';
import { TrainingDataService } from './training-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingData } from 'src/entities/training-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainingData])],
  controllers: [TrainingDataController],
  providers: [TrainingDataService],
  exports:[TrainingDataService]
})
export class TrainingDataModule {}
