import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ModalService } from '../../../services/modal.service';
import { Cue, SubtitleService } from '../../../services/subtitle.service';
import { CueEditComponent } from './cue-edit.component';

describe('CueEditComponent', () => {
  let component: CueEditComponent;
  let fixture: ComponentFixture<CueEditComponent>;
  let modalService: ModalService;
  let subtitleService: SubtitleService;
  const initialStartTime = 1;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CueEditComponent],
      imports: [FormsModule]
    }).compileComponents();
  }));

  beforeEach(inject(
    [ModalService, SubtitleService],
    (_modalService_: ModalService, _subtitleService_: SubtitleService) => {
      modalService = _modalService_;
      subtitleService = _subtitleService_;
      spyOn(modalService, 'close');
      spyOn(subtitleService, 'add');
      spyOn(subtitleService, 'reIndex');
    }
  ));

  beforeEach(() => {
    fixture = TestBed.createComponent(CueEditComponent);
    component = fixture.componentInstance;

    const cue = new Cue();
    cue.start = initialStartTime;
    cue.end = 2;
    cue.text = ['hello', 'world'];
    component.cue = cue;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should copy input cue to form cue', () => {
    component.ngAfterViewInit();
    expect(component.cue.start).toBe(component.formCue.start);
    expect(component.cue.end).toBe(component.formCue.end);
  });

  it('should add empty textbox after index', () => {
    component.ngAfterViewInit();
    component.addAfterIndex(0);
    expect(component.formCue.text.length).toBe(3);
    expect(component.formCue.text[1]).toBe('');
    expect(component.formCue.text[2]).toBe('world');
  });

  it('should remove textbox after index', () => {
    component.ngAfterViewInit();
    component.removeAtIndex(0);
    expect(component.formCue.text.length).toBe(1);
    expect(component.formCue.text[0]).toBe('world');
  });

  it('should save for existing cue edit mode', () => {
    component.ngAfterViewInit();
    component.save();
    expect(modalService.close).toHaveBeenCalled();
  });

  it('should save for existing cue edit mode and the start time has changed', () => {
    component.ngAfterViewInit();
    component.formCue.start = 2;
    component.save();
    expect(modalService.close).toHaveBeenCalled();
    expect(subtitleService.reIndex).toHaveBeenCalledWith(component.cue, initialStartTime);
  });

  it('should save with new cue edit mode', () => {
    component.isNewCueEditMode = true;
    component.ngAfterViewInit();
    component.save();
    expect(modalService.close).toHaveBeenCalled();
    expect(subtitleService.add).toHaveBeenCalledWith(component.cue);
  });

  it('should remove empty text', () => {
    component.ngAfterViewInit();
    component.addAfterIndex(0);
    component.addAfterIndex(0);
    component.save();
    expect(component.cue.text.length).toBe(2);
  });
});
