import { Test, TestingModule } from '@nestjs/testing';
import { TrainingDataController } from './training-data.controller';

describe('TrainingDataController', () => {
  let controller: TrainingDataController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainingDataController],
    }).compile();

    controller = module.get<TrainingDataController>(TrainingDataController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
