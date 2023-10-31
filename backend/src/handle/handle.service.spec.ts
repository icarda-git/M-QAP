import { Test, TestingModule } from '@nestjs/testing';
import { HandleService } from './handle.service';

describe('HandleService', () => {
  let service: HandleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HandleService],
    }).compile();

    service = module.get<HandleService>(HandleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
