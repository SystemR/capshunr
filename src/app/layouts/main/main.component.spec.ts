import { SubtitleService } from './../../services/subtitle.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoComponent } from '../../components/video/video.component';
import { TimingService } from '../../services/timing.service';
import { VideoService } from './../../services/video.service';
import { MainComponent } from './main.component';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MainComponent, VideoComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
