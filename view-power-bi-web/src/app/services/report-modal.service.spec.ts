import { TestBed } from '@angular/core/testing';

import { ReportModalService } from './report-modal.service';

describe('ReportModalService', () => {
  let service: ReportModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
