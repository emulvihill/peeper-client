import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoSnapTileComponent } from './video-snap-tile.component';

describe('VideoSnapTileComponent', () => {
  let component: VideoSnapTileComponent;
  let fixture: ComponentFixture<VideoSnapTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoSnapTileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoSnapTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
