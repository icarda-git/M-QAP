import { Injectable } from '@nestjs/common';
import { Expose, Transform, plainToClass } from 'class-transformer';
import { isNumber } from 'class-validator';
import { PaginateQuery } from 'nestjs-paginate';
import { CommoditiesService } from 'src/commodities/commodities.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PredictionsService } from 'src/predictions/predictions.service';
import { TrainingCycleService } from 'src/training-cycle/training-cycle.service';

class PredictionsForEachCycle {
  @Expose()
  cycle_id: number;

  @Expose()
  predictions_count: number;
}

class PredictionsAverageForEachCycle {
  @Expose()
  cycle_id: number;

  @Expose()
  @Transform(({ value }) => {
    console.log('V : ', value);
    return !!value ? value : 0;
  })
  predictions_average: number = 0;
}

@Injectable()
export class StatisticsService {
  constructor(
    private organizationsService: OrganizationsService,
    private predictionsService: PredictionsService,
    private trainingCycleService: TrainingCycleService,
    private commoditiesService: CommoditiesService,
  ) {}

  async findAll() {
    const total: { [key: string]: any } = {};
    total.totalCommodities = await this.findTotalCommodities();
    total.totalOrganization = await this.findTotalOrganization();
    total.totalTrainingCycle = await this.findTotalTrainingCycle();
    total.totalPrediction = await this.findTotalPrediction();
    total.chartData = await this.findTrainingCycleData();
    total.cyclePredictionsAverage =
      await this.findTrainingCyclePredictionsAverage();

    console.log(total);
    return total;
  }

  findTotalCommodities() {
    const query: PaginateQuery = {
      path: '',
      limit: 0,
      page: 1,
    };
    return this.commoditiesService
      .findAll(query)
      .then((result) => result.meta.totalItems);
  }

  findTotalOrganization() {
    const query: PaginateQuery = {
      path: '',
      limit: 0,
      page: 1,
    };
    return this.organizationsService
      .findAll(query)
      .then((result) => result.meta.totalItems);
  }

  findTotalTrainingCycle() {
    const query: PaginateQuery = {
      path: '',
      limit: 0,
      page: 1,
    };
    return this.trainingCycleService
      .findAll(query)
      .then((result) => result.meta.totalItems);
  }

  findTotalPrediction() {
    const query: PaginateQuery = {
      path: '',
      limit: 0,
      page: 1,
    };
    return this.predictionsService
      .findAll(query)
      .then((result) => result.meta.totalItems);
  }

  async findTrainingCycleData() {
    const q = await this.trainingCycleService.trainingCycleRepository
      .createQueryBuilder('cycle')
      .select('cycle.id', 'cycle_id')
      .addSelect('COUNT(predictions.id) as predictions_count')
      .leftJoin('cycle.predictions', 'predictions')
      .groupBy('cycle.id')
      .orderBy('cycle_id', 'DESC')
      .execute();

    return plainToClass(PredictionsForEachCycle, q, {
      enableImplicitConversion: true,
      enableCircularCheck: true,
    });
  }

  async findTrainingCyclePredictionsAverage() {
    const q = await this.trainingCycleService.trainingCycleRepository
      .createQueryBuilder('cycle')
      .select('cycle.id', 'cycle_id')
      .addSelect('AVG(predictions.confidant) as predictions_average')
      .leftJoin('cycle.predictions', 'predictions')
      .groupBy('cycle.id')
      .orderBy('cycle_id', 'DESC')
      .execute();

    return plainToClass(PredictionsAverageForEachCycle, q, {
      enableImplicitConversion: true,
      enableCircularCheck: true,
      exposeDefaultValues: true,
    });
  }
}
