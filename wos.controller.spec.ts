import { Test, TestingModule } from '@nestjs/testing';
import { WosController } from './wos.controller';

describe('Wos Controller', () => {
  let controller: WosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WosController],
    }).compile();

    controller = module.get<WosController>(WosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
