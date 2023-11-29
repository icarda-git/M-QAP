import { Test, TestingModule } from '@nestjs/testing';
import { CommoditiesController } from './commodities.controller';

describe('CommoditiesController', () => {
  let controller: CommoditiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommoditiesController],
    }).compile();

    controller = module.get<CommoditiesController>(CommoditiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
