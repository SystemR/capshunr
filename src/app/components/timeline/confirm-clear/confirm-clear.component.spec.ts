import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { ModalService } from '../../../services/modal.service';
import { SubtitleService } from '../../../services/subtitle.service';
import { ConfirmClearComponent } from './confirm-clear.component';

describe('ConfirmClearComponent', () => {
  let component: ConfirmClearComponent;
  let fixture: ComponentFixture<ConfirmClearComponent>;
  let modalService: ModalService;
  let subtitleService: SubtitleService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmClearComponent],
      providers: [ModalService, SubtitleService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmClearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject(
    [ModalService, SubtitleService],
    (_ModalService_: ModalService, _SubtitleService_: SubtitleService) => {
      modalService = _ModalService_;
      subtitleService = _SubtitleService_;
      spyOn(modalService, 'close');
      spyOn(subtitleService, 'clearCues');
    }
  ));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call close on cancel', () => {
    component.cancel();
    expect(modalService.close).toHaveBeenCalled();
  });

  it('should call clear cues on subtitleService', () => {
    component.ok();
    expect(subtitleService.clearCues).toHaveBeenCalled();
    expect(modalService.close).toHaveBeenCalled();
  });
});
