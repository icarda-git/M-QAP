import { Test, TestingModule } from '@nestjs/testing';
import { CommoditiesService } from './commodities.service';

describe('CommoditiesService', () => {
  let service: CommoditiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommoditiesService],
    }).compile();

    service = module.get<CommoditiesService>(CommoditiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
