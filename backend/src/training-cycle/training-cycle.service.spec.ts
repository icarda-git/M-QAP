import { Test, TestingModule } from '@nestjs/testing';
import { TrainingCycleService } from './training-cycle.service';

describe('TrainningCycleService', () => {
  let service: TrainingCycleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainingCycleService],
    }).compile();

    service = module.get<TrainingCycleService>(TrainingCycleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
