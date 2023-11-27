import { TestBed } from '@angular/core/testing';

import { TrainningCycleService } from './trainning-cycle.service';

describe('TrainningCycleService', () => {
  let service: TrainningCycleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainningCycleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
