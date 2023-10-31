import { Test, TestingModule } from '@nestjs/testing';
import { DoiService } from './doi.service';

describe('DoiService', () => {
  let service: DoiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DoiService],
    }).compile();

    service = module.get<DoiService>(DoiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
