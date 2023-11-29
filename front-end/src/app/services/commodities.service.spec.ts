import { TestBed } from '@angular/core/testing';

import { CommoditiesService } from './commodities.service';

describe('CommoditiesService', () => {
  let service: CommoditiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommoditiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
