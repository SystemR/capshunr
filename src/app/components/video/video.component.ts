import { Component, OnInit, ViewChild } from '@angular/core';

import { TimeSubscriber, TimingService } from '../../services/timing.service';
import { VideoService, VideoSubscriber } from '../../services/video.service';
import { Cue, SubtitleService } from './../../services/subtitle.service';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit, TimeSubscriber, VideoSubscriber {
  @ViewChild('videoPlayer') videoPlayer: any;
  isVideoLoaded = false;
  displayCue: Cue;

  constructor(
    private videoService: VideoService,
    private subtitleService: SubtitleService,
    private timingService: TimingService
  ) {
    this.videoService.subscribe(this);
    this.timingService.subscribe(this);
  }

  ngOnInit() {
    this.videoService.setElement(this.videoPlayer);
  }

  togglePlay() {
    if (this.videoService.isPlaying) {
      this.videoService.pause();
    } else {
      this.videoService.play();
    }
  }

  onVideoLoaded() {
    this.isVideoLoaded = true;
  }

  onTime(time: number) {
    this.displayCue = this.subtitleService.getSubtitleAtTime(time);
  }
}
