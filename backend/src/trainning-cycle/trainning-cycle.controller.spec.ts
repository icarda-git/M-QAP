import { Test, TestingModule } from '@nestjs/testing';
import { TrainningCycleController } from './trainning-cycle.controller';

describe('TrainningCycleController', () => {
  let controller: TrainningCycleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrainningCycleController],
    }).compile();

    controller = module.get<TrainningCycleController>(TrainningCycleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
