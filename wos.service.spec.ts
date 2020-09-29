import { Test, TestingModule } from '@nestjs/testing';
import { WosService } from './wos.service';

describe('WosService', () => {
  let service: WosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WosService],
    }).compile();

    service = module.get<WosService>(WosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
