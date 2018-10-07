import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ModalService } from '../../../services/modal.service';
import { SubtitleService } from '../../../services/subtitle.service';
import { TimingService } from '../../../services/timing.service';
import { VideoService } from '../../../services/video.service';
import { CueEditComponent } from '../cue-edit/cue-edit.component';
import { config } from './../../../app.config';
import { Cue } from './../../../services/subtitle.service';
import { CueComponent } from './cue.component';

describe('CueComponent', () => {
  let component: CueComponent;
  let fixture: ComponentFixture<CueComponent>;
  let subtitleService: SubtitleService;
  let modalService: ModalService;
  let videoService: VideoService;

  const start = 2;
  const end = 4;
  const top = start * config.MULTIPLIER;
  const height = (end - start) * config.MULTIPLIER;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CueComponent, CueEditComponent],
      providers: [SubtitleService, ModalService, VideoService, TimingService],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CueComponent);
    component = fixture.componentInstance;
    const cue = new Cue();
    cue.start = start;
    cue.end = end;
    cue.text = ['hello world'];
    component.cue = cue;
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
      spyOn(subtitleService, 'reIndex');
      spyOn(modalService, 'show').and.callFake(() => {
        return 'hello';
      });
    }
  ));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have the right top and height on init', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.style.top).toBe(top + 'px');
    expect(compiled.style.height).toBe(height + 'px');
  });

  it('should handle drag on header', () => {
    const startDragAtPx = top;
    const moveMousePx = 5;

    const mousedownEvent = new MouseEvent('mousedown', {
      clientY: startDragAtPx
    });
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientY: startDragAtPx - moveMousePx
    });
    const mouseUpEvent = new MouseEvent('mouseup', {
      clientY: startDragAtPx - moveMousePx
    });

    const duration = end - start;
    component.header.nativeElement.dispatchEvent(mousedownEvent);
    expect(component.startTimeOnDragStart).toBe(start);
    expect(component.startY).toBe(startDragAtPx);

    // Move mouse
    document.dispatchEvent(mouseMoveEvent);
    const changesInSeconds = (component.startY - (startDragAtPx - moveMousePx)) / config.MULTIPLIER;
    const cue = component.cue;
    const newStart = component.startTimeOnDragStart - changesInSeconds;
    expect(cue.start).toBe(newStart);
    expect(component.top).toBe(newStart * config.MULTIPLIER + 'px');

    // No changes in duration
    expect(cue.end).toBe(cue.start + duration);
    expect(component.height).toBe(duration * config.MULTIPLIER + 'px');

    // Upon mouseup, cue component should call subtitle service to reindex (for quick lookup when rendering on video)
    // cue should also be sanitized (truncating to 3 digits)
    spyOn(cue, 'sanitize');
    document.dispatchEvent(mouseUpEvent);
    expect(cue.sanitize).toHaveBeenCalled();
    expect(subtitleService.reIndex).toHaveBeenCalledWith(cue, component.startTimeOnDragStart);

    expect(videoService.pause).toHaveBeenCalled();
  });

  it('should handle drag on expander', () => {
    const startDragAtPx = top + height;
    const moveMousePx = 20;

    const mousedownEvent = new MouseEvent('mousedown', {
      clientY: startDragAtPx
    });
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientY: startDragAtPx + moveMousePx
    });
    component.expander.nativeElement.dispatchEvent(mousedownEvent);
    expect(component.endTimeOnDragStart).toBe(end);
    expect(component.startY).toBe(startDragAtPx);

    // Move mouse
    document.dispatchEvent(mouseMoveEvent);
    const changesInSeconds = (component.startY - (startDragAtPx + moveMousePx)) / config.MULTIPLIER;
    const cue = component.cue;

    expect(cue.end).toBe(component.endTimeOnDragStart - changesInSeconds);
    expect(component.height).toBe((cue.end - cue.start) * config.MULTIPLIER + 'px');
    expect(videoService.pause).toHaveBeenCalled();
  });

  it('should handle double click and show modal', () => {
    const dblClickEvent = new MouseEvent('dblclick');
    component.content.nativeElement.dispatchEvent(dblClickEvent);
    expect(modalService.show).toHaveBeenCalledWith(CueEditComponent, jasmine.any(Function));
  });
});
