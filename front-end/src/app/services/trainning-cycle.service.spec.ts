import { TestBed } from '@angular/core/testing';

import { TrainingCycleService } from './trainning-cycle.service';

describe('TrainningCycleService', () => {
  let service: TrainingCycleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainingCycleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
