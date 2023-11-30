import { Test, TestingModule } from '@nestjs/testing';
import { TrainingDataService } from './training-data.service';

describe('TrainningDataService', () => {
  let service: TrainingDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingDataService],
    }).compile();

    service = module.get<TrainingDataService>(TrainingDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
