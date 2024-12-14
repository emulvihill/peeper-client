import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnapComparisonViewComponent } from './snap-comparison-view.component';

describe('SnapComparisonViewComponent', () => {
  let component: SnapComparisonViewComponent;
  let fixture: ComponentFixture<SnapComparisonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SnapComparisonViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SnapComparisonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
