import { Module } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { OrganizationsModule } from 'src/organizations/organizations.module';
import { PredictionsModule } from 'src/predictions/predictions.module';
import { TrainingCycleModule } from 'src/training-cycle/training-cycle.module';
import { CommoditiesModule } from 'src/commodities/commodities.module';
import { TrainingDataModule } from 'src/training-data/training-data.module';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService],
  imports: [
    OrganizationsModule,
    PredictionsModule,
    TrainingCycleModule,
    CommoditiesModule,
    TrainingDataModule
  ],
})
export class StatisticsModule {}
