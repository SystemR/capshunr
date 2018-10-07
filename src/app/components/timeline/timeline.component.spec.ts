import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { config } from '../../app.config';
import { ModalService } from '../../services/modal.service';
import { Cue, SubtitleService } from '../../services/subtitle.service';
import { TimingService } from '../../services/timing.service';
import { VideoService } from '../../services/video.service';
import { CueComponent } from './cue/cue.component';
import { TimelineComponent } from './timeline.component';

describe('TimelineComponent', () => {
  let component: TimelineComponent;
  let fixture: ComponentFixture<TimelineComponent>;
  let subtitleService: SubtitleService;
  let modalService: ModalService;
  let videoService: VideoService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TimelineComponent, CueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject(
    [SubtitleService, ModalService, VideoService],
    (
      _subtitleService_: SubtitleService,
      _modalService_: ModalService,
      _videoService_: VideoService
    ) => {
      subtitleService = _subtitleService_;
      modalService = _modalService_;
      videoService = _videoService_;

      spyOn(videoService, 'pause');
      spyOn(subtitleService, 'findCueOnSecond').and.callFake(() => {
        const cue = new Cue();
        return cue;
      });
      spyOn(modalService, 'show').and.callFake(() => {
        return 'hello';
      });
    }
  ));

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.numbers.length).toBe(config.TIMELINE_NUMS_ON_START + 1);
  });

  it('should update numbers on update duration', () => {
    const newDurationInSeconds = 500;
    component.onDuration(newDurationInSeconds);
    expect(component.numbers.length).toBe(newDurationInSeconds + 1);
  });

  it('should update numbers on update duration', () => {
    const newDurationInSeconds = 500;
    component.onDuration(newDurationInSeconds);
    expect(component.numbers.length).toBe(newDurationInSeconds + 1);
  });
});
