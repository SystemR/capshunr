import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';

import { config } from '../../../app.config';
import { ModalInterface, ModalService } from '../../../services/modal.service';
import { Cue, SubtitleService } from '../../../services/subtitle.service';

@Component({
  selector: 'app-cue-edit',
  templateUrl: './cue-edit.component.html',
  styleUrls: ['./cue-edit.component.scss']
})
export class CueEditComponent implements AfterViewInit, ModalInterface {
  @Input() cue: Cue;
  @ViewChild('texts') texts;
  formCue: Cue = new Cue();
  duration: number;
  hasStartTimeError = false;
  hasEndTimeError = false;
  hasTextError = false;
  isNewCueEditMode = false;

  public onSave: any;

  constructor(private modalService: ModalService, private subtitleService: SubtitleService) {}

  trackByIndex(index: number, value: number) {
    return index;
  }

  ngAfterViewInit() {
    const cue = this.cue;
    const formCue = this.formCue;

    Object.assign(formCue, cue);
    formCue.text = cue.text.slice(0);
    this.updateTime();
  }

  onShow() {
    const allInputs = this.texts.nativeElement.querySelectorAll('input');
    if (allInputs.length) {
      allInputs[allInputs.length - 1].focus();
    }
  }

  addAfterIndex(index: number) {
    this.formCue.text.splice(index + 1, 0, '');
  }

  removeAtIndex(index: number) {
    this.formCue.text.splice(index, 1);
    if (!this.formCue.text.length) {
      this.formCue.text.push('');
      this.hasTextError = true;
    }
  }

  save() {
    const cue = this.cue;
    const formCue = this.formCue;

    const prevStartTime = cue.start;
    cue.start = formCue.start;
    cue.end = formCue.end;

    const texts = formCue.text;
    cue.text = texts.filter(entry => {
      return entry;
    });
    cue.sanitize();
    if (this.isNewCueEditMode) {
      // Is new
      this.subtitleService.add(cue);
    } else {
      if (cue.start !== prevStartTime) {
        this.subtitleService.reIndex(cue, prevStartTime);
      }
    }

    if (this.onSave) {
      this.onSave();
    }
    this.modalService.close();
  }

  cancel() {
    this.modalService.close();
  }

  removeCue() {
    this.subtitleService.removeSubtitle(this.cue);
    this.modalService.close();
  }

  validateText() {
    const texts = this.formCue.text;
    const textsEmpty = texts.filter(entry => {
      return entry;
    });
    if (!textsEmpty.length) {
      this.hasTextError = true;
    } else {
      this.hasTextError = false;
    }
  }

  onDurationUpdate() {
    this.formCue.end = this.formCue.start + this.duration;
    this.updateTime();
  }

  updateTime() {
    this.formCue.sanitize();
    this.updateDuration();
    this.validateText();
    const startTime = this.formCue.start;
    const endTime = this.formCue.end;

    const prev = this.formCue.prev;
    const next = this.formCue.next;

    if (startTime < 0 || (prev && startTime < prev.end) || (next && startTime > next.start)) {
      this.hasStartTimeError = true;
    } else {
      this.hasStartTimeError = false;
    }

    if (
      endTime < config.CUE_MIN_TIME ||
      (next && endTime > next.start) ||
      endTime - startTime < config.CUE_MIN_TIME
    ) {
      this.hasEndTimeError = true;
    } else {
      this.hasEndTimeError = false;
    }
  }

  private updateDuration() {
    this.duration = this.formCue.end - this.formCue.start;
    this.duration = parseFloat(this.duration.toFixed(3));
  }
}
