import { TestBed } from '@angular/core/testing';

import { TrainningDataService } from './trainning-data.service';

describe('TrainningDataService', () => {
  let service: TrainningDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrainningDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
