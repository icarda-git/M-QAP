import { Module } from '@nestjs/common';
import { TrainningDataController } from './trainning-data.controller';
import { TrainningDataService } from './trainning-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainningData } from 'src/entities/trainning-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrainningData])],
  controllers: [TrainningDataController],
  providers: [TrainningDataService]
})
export class TrainningDataModule {}
