import { Module } from '@nestjs/common';
import { CommoditiesController } from './commodities.controller';
import { CommoditiesService } from './commodities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Commodity } from 'src/entities/commodities.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Commodity])],
  controllers: [CommoditiesController],
  providers: [CommoditiesService],
  exports:[CommoditiesService]
})
export class CommoditiesModule {}
