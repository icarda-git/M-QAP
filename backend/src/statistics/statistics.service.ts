import { Injectable } from '@nestjs/common';
import { Expose, Transform, plainToClass } from 'class-transformer';
import { PaginateQuery } from 'nestjs-paginate';
import { CommoditiesService } from 'src/commodities/commodities.service';
import { OrganizationsService } from 'src/organizations/organizations.service';
import { PredictionsService } from 'src/predictions/predictions.service';
import { TrainingCycleService } from 'src/training-cycle/training-cycle.service';
import { TrainingDataService } from 'src/training-data/training-data.service';

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
    private trainingDataService: TrainingDataService,
    private commoditiesService: CommoditiesService,
  ) {}

  async findAll() {
    const total: { [key: string]: any } = {};
    total.totalCommodities = await this.findTotalCommodities();
    total.totalOrganization = await this.findTotalOrganization();
    total.totalTrainingCycle = await this.findTotalTrainingCycle();
    total.totalTrainingData = await this.findTotalTrainingData();
    total.totalPrediction = await this.findTotalPrediction();
    total.chartData = await this.findTrainingCycleData();
    total.cyclePredictionsAverage =
      await this.findTrainingCyclePredictionsAverage();
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

  findTotalTrainingData() {
    const query: PaginateQuery = {
      path: '',
      limit: 0,
      page: 1,
    };
    return this.trainingDataService
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
      .addSelect('COUNT(prediction.id) as predictions_count')
      .leftJoin('cycle.predictions', 'prediction')
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
      .addSelect('AVG(prediction.confidant) as predictions_average')
      .leftJoin('cycle.predictions', 'prediction')
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
