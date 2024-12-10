import { TestBed } from '@angular/core/testing';

import { VideoSnapService } from './video-snap.service';

describe('VideoSnapService', () => {
  let service: VideoSnapService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VideoSnapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
