import { Component, OnInit, ViewChild } from '@angular/core';

import { ModalService } from '../../services/modal.service';
import { Cue, SubtitleService } from '../../services/subtitle.service';
import { TimeSubscriber, TimingService } from '../../services/timing.service';
import { VideoService } from '../../services/video.service';
import { config } from './../../app.config';
import { ConfirmClearComponent } from './confirm-clear/confirm-clear.component';
import { CueEditComponent } from './cue-edit/cue-edit.component';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit, TimeSubscriber {
  @ViewChild('cursor') cursor;
  @ViewChild('timeline') timeline;
  @ViewChild('timelineContainer') timelineContainer;

  duration: number;
  time = 0;
  scroll: number;
  numbers: number[];

  cues: Cue[];

  constructor(
    private subtitleService: SubtitleService,
    private modalService: ModalService,
    private timingService: TimingService,
    private videoService: VideoService
  ) {
    timingService.subscribe(this);
    this.cues = subtitleService.getCues();
  }

  ngOnInit() {
    const el = this.timelineContainer.nativeElement;
    el.addEventListener('wheel', e => {
      let scrollTop = el.scrollTop;
      if (scrollTop <= 0) {
        scrollTop = 0;
      }
      this.time = scrollTop / config.MULTIPLIER;
      this.timingService.setTime(this.time, this);
    });

    // Prevent spacebar from scrolling
    window.addEventListener('keydown', e => {
      const code = e.code;
      const isWithShift = e.shiftKey;
      if (code === 'Space' && e.target === document.body) {
        e.stopPropagation();
        e.preventDefault();
        return false;
      }
    });

    const arr = [];
    let b = config.TIMELINE_NUMS_ON_START;
    while (b--) {
      arr[b] = b + 1;
    }
    arr.unshift(0);
    this.numbers = arr;
  }

  onDuration(duration: number) {
    this.duration = duration;
    this.timeline.nativeElement.style.height =
      Math.ceil(duration) * config.MULTIPLIER + duration + 'px';

    const arr = [];
    let b = Math.ceil(duration);
    while (b--) {
      arr[b] = b + 1;
    }
    arr.unshift(0);
    this.numbers = arr;
  }

  onTime(time: number) {
    this.time = time;
    this.scroll = time * config.MULTIPLIER;
    this.timelineContainer.nativeElement.scrollTop = this.scroll;
  }

  add() {
    let searchTime = this.time;
    let startTime = null;
    let prevCue = null,
      currentCue = null;
    while (startTime === null && startTime < this.duration) {
      currentCue = this.subtitleService.getSubtitleAtTime(searchTime);
      if (currentCue) {
        searchTime = currentCue.end + config.CUE_ON_ADD_SEARCH_INCREMENT;
        prevCue = currentCue;
      } else if (prevCue) {
        const next = prevCue.next;
        const endTimeIfAdded =
          searchTime + config.CUE_ON_ADD_DURATION + config.CUE_ON_ADD_SEARCH_INCREMENT;
        const isCueFitIfAdded = next && endTimeIfAdded > next.start;
        if (isCueFitIfAdded) {
          searchTime = next.end + config.CUE_ON_ADD_SEARCH_INCREMENT;
          prevCue = next;
        } else {
          startTime = searchTime;
        }
      } else {
        startTime = searchTime;
      }
    }

    const newCue = new Cue();
    newCue.start = startTime || 0;
    newCue.end = startTime + config.CUE_ON_ADD_DURATION;
    newCue.text = [''];

    if (!prevCue) {
      // Find backward until 0
      let roundedSecond = Math.floor(startTime);

      while (roundedSecond > 0) {
        const result = this.subtitleService.findCueOnSecond(startTime, roundedSecond);
        if (result) {
          prevCue = result;
          break;
        }
        roundedSecond--;
      }
    }

    if (prevCue) {
      newCue.prev = prevCue;
      newCue.next = prevCue.next;
    }

    newCue.sanitize();

    this.videoService.pause();
    this.timingService.setTime(newCue.start, this);
    this.modalService.show(CueEditComponent, (modal: CueEditComponent) => {
      modal.cue = newCue;
      modal.isNewCueEditMode = true;
    });
  }

  clear() {
    this.videoService.pause();
    this.modalService.show(ConfirmClearComponent);
  }
}
