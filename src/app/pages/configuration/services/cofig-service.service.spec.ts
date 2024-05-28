import { TestBed } from '@angular/core/testing';

import { CofigServiceService } from './cofig-service.service';

describe('CofigServiceService', () => {
  let service: CofigServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CofigServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
