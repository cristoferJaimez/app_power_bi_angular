import { TestBed } from '@angular/core/testing';

import { ReportCredentialsService } from './report-credentials.service';

describe('ReportCredentialsService', () => {
  let service: ReportCredentialsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportCredentialsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
