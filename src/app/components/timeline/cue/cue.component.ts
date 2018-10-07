import { Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';

import { ModalService } from '../../../services/modal.service';
import { VideoService } from '../../../services/video.service';
import { CueEditComponent } from '../cue-edit/cue-edit.component';
import { config } from './../../../app.config';
import { Cue, SubtitleService } from './../../../services/subtitle.service';

@Component({
  selector: 'app-cue',
  templateUrl: './cue.component.html',
  styleUrls: ['./cue.component.scss']
})
export class CueComponent implements OnInit {
  @Input('cue') cue: Cue;
  @HostBinding('style.top') top: string;
  @HostBinding('style.height') height: string;

  @ViewChild('header') header;
  @ViewChild('content') content;
  @ViewChild('expander') expander;

  mouseMoveChangeStartTimeHandler: any;
  mouseUpChangeStartTimeHandler: any;
  mouseMoveChangeEndTimeHandler: any;
  mouseUpChangeEndTimeHandler: any;

  startTimeOnDragStart: number;
  endTimeOnDragStart: number;
  startY: number;

  constructor(
    private subtitleService: SubtitleService,
    private modalService: ModalService,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    this._setPosAndHeight();
  }

  private _setPosAndHeight() {
    const cue = this.cue;
    const pos = Math.ceil(cue.start * config.MULTIPLIER);
    const height = (cue.end - cue.start) * config.MULTIPLIER;
    this.top = pos + 'px';
    this.height = height + 'px';
  }

  editCue() {
    this.videoService.pause();
    this.modalService.show(CueEditComponent, modal => {
      modal.cue = this.cue;
      modal.onSave = this._setPosAndHeight.bind(this);
    });
  }

  /****************************************************************************
   * Drag Header Handling
   ****************************************************************************/
  startChangeStartTime($event) {
    this.videoService.pause();
    this.startY = $event.clientY;
    this.startTimeOnDragStart = this.cue.start;
    this.mouseMoveChangeStartTimeHandler = this.onMouseMoveChangeStartTime.bind(this);
    this.mouseUpChangeStartTimeHandler = this.onMouseUpChangeStartTime.bind(this);
    document.addEventListener('mousemove', this.mouseMoveChangeStartTimeHandler);
    document.addEventListener('mouseup', this.mouseUpChangeStartTimeHandler);
  }

  onMouseMoveChangeStartTime(ev) {
    const changesInSeconds = (this.startY - ev.clientY) / config.MULTIPLIER;

    const cue = this.cue;
    const duration = cue.end - cue.start;

    let newStart = this.startTimeOnDragStart - changesInSeconds;

    if (cue.prev && newStart <= cue.prev.end) {
      newStart = cue.prev.end + 0.001;
    }

    const newEnd = newStart + duration;
    if (cue.next && cue.next.start < newEnd) {
      newStart = cue.next.start - duration;
    }

    if (newStart < 0) {
      newStart = 0;
    }
    cue.start = newStart;
    cue.end = newStart + duration;

    this.top = cue.start * config.MULTIPLIER + 'px';
  }

  onMouseUpChangeStartTime(ev) {
    this.cue.sanitize();
    this.subtitleService.reIndex(this.cue, this.startTimeOnDragStart);
    document.removeEventListener('mousemove', this.mouseMoveChangeStartTimeHandler);
    document.removeEventListener('mouseup', this.mouseUpChangeStartTimeHandler);
  }

  /****************************************************************************
   * Drag Expander Handling
   ****************************************************************************/
  startChangeEndTime($event) {
    this.videoService.pause();
    this.startY = $event.clientY;
    this.endTimeOnDragStart = this.cue.end;
    this.mouseMoveChangeEndTimeHandler = this.onMouseMoveChangeEndTime.bind(this);
    this.mouseUpChangeEndTimeHandler = this.onMouseUpChangeEndTime.bind(this);
    document.addEventListener('mousemove', this.mouseMoveChangeEndTimeHandler);
    document.addEventListener('mouseup', this.mouseUpChangeEndTimeHandler);
  }

  onMouseMoveChangeEndTime(ev) {
    const changesInSeconds = (this.startY - ev.clientY) / config.MULTIPLIER;

    const cue = this.cue;
    let newEnd = this.endTimeOnDragStart - changesInSeconds;
    if (newEnd - cue.start < config.CUE_MIN_TIME) {
      newEnd = cue.start + config.CUE_MIN_TIME;
    }
    if (cue.next && newEnd > cue.next.start) {
      newEnd = cue.next.start;
    }
    cue.end = newEnd;
    this.height = (cue.end - cue.start) * config.MULTIPLIER + 'px';
  }

  onMouseUpChangeEndTime(ev) {
    this.cue.sanitize();
    document.removeEventListener('mousemove', this.mouseMoveChangeEndTimeHandler);
    document.removeEventListener('mouseup', this.mouseUpChangeEndTimeHandler);
  }
}
