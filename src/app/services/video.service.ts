import { ElementRef, Injectable } from '@angular/core';

import { TimeSubscriber, TimingService } from './timing.service';

export interface VideoSubscriber {
  onVideoLoaded();
}

// When pressing arrow keys to adjust time
const SMALL_TIME_INCREMENT = 0.003;
const BIG_TIME_INCREMENT = 0.1;

@Injectable({
  providedIn: 'root'
})
export class VideoService implements TimeSubscriber {
  videoPlayer: HTMLVideoElement;
  currentTime: number;
  duration: number;
  isLoaded = false;
  isPlaying = false;

  private eventSubscribers: VideoSubscriber[] = [];

  constructor(private timingService: TimingService) {
    this.timingService.subscribe(this);
    document.addEventListener('keyup', ev => {
      if (this.isLoaded) {
        const code = ev.code;
        const isWithShift = ev.shiftKey;
        if (code === 'Space') {
          if (this.isPlaying) {
            this.pause();
          } else {
            this.play();
          }
          ev.preventDefault();
          return false;
        } else if (code === 'ArrowRight') {
          let increment = SMALL_TIME_INCREMENT;
          if (isWithShift) {
            increment = BIG_TIME_INCREMENT;
          }
          this.onTime(this.currentTime + increment);
          this.timingService.setTime(this.currentTime, this);
        } else if (code === 'ArrowLeft') {
          let increment = SMALL_TIME_INCREMENT;
          if (isWithShift) {
            increment = BIG_TIME_INCREMENT;
          }
          this.onTime(this.currentTime - increment);
          this.timingService.setTime(this.currentTime, this);
        }
      }
    });
  }

  subscribe(subscriber: VideoSubscriber) {
    this.eventSubscribers.push(subscriber);
  }

  setElement(el: ElementRef) {
    this.videoPlayer = el.nativeElement;
  }

  load(file) {
    const videoPlayer = this.videoPlayer;
    this.duration = 0;
    videoPlayer.src = URL.createObjectURL(file);
    videoPlayer.oncanplay = () => {
      if (!this.duration) {
        this.isLoaded = true;
        this.duration = videoPlayer.duration;
        this.timingService.setDuration(videoPlayer.duration);

        for (const subscriber of this.eventSubscribers) {
          subscriber.onVideoLoaded();
        }
      }
    };

    videoPlayer.play();
    this.isPlaying = true;

    this.runLoop();
  }

  private runLoop() {
    this.currentTime = this.videoPlayer.currentTime;
    if (this.isPlaying) {
      this.timingService.setTime(this.currentTime, this);
    }
    requestAnimationFrame(this.runLoop.bind(this));
  }

  pause() {
    if (this.isLoaded) {
      this.videoPlayer.pause();
      this.isPlaying = false;
    }
  }

  play() {
    if (this.isLoaded) {
      this.videoPlayer.play();
      this.isPlaying = true;
    }
  }

  onTime(time: number) {
    this.currentTime = time;
    this.videoPlayer.currentTime = time;
  }
}
