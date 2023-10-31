import { Test, TestingModule } from '@nestjs/testing';
import { TrainningDataController } from './trainning-data.controller';

describe('TrainningDataController', () => {
  let controller: TrainningDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainningDataController],
    }).compile();

    controller = module.get<TrainningDataController>(TrainningDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
