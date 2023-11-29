import { Module } from '@nestjs/common';
import { CommoditiesController } from './commodities.controller';
import { CommoditiesService } from './commodities.service';
import { Commodities } from 'src/entities/commodities.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Commodities])],
  controllers: [CommoditiesController],
  providers: [CommoditiesService],
  exports:[CommoditiesService]
})
export class CommoditiesModule {}
