import { Test, TestingModule } from '@nestjs/testing';
import { TrainningDataService } from './trainning-data.service';

describe('TrainningDataService', () => {
  let service: TrainningDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrainningDataService],
    }).compile();

    service = module.get<TrainningDataService>(TrainningDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
