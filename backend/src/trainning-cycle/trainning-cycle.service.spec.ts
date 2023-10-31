import { Test, TestingModule } from '@nestjs/testing';
import { TrainningCycleService } from './trainning-cycle.service';

describe('TrainningCycleService', () => {
  let service: TrainningCycleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainningCycleService],
    }).compile();

    service = module.get<TrainningCycleService>(TrainningCycleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
