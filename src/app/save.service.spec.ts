import { TestBed, inject } from '@angular/core/testing';

import { SaveService } from './save.service';

describe('SaveService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SaveService]
    });
  });

  it('should be created', inject([SaveService], (service: SaveService) => {
    expect(service).toBeTruthy();
  }));
});
