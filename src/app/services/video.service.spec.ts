import { ElementRef } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';

import { TimingService } from './timing.service';
import { VideoService } from './video.service';

const mockHTMLMediaElement = {
  play() {},
  pause() {}
};

describe('VideoService', () => {
  let videoService: VideoService;
  let timingService: TimingService;

  let videoPlayer: HTMLMediaElement;

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  beforeEach(inject([TimingService], (_timingService_: TimingService) => {
    timingService = _timingService_;
    spyOn(timingService, 'subscribe');
    spyOn(document, 'addEventListener').and.callThrough();
  }));

  beforeEach(inject([VideoService], (_videoService_: VideoService) => {
    videoService = _videoService_;
  }));

  it('should be created', () => {
    expect(videoService).toBeTruthy();

    // Should subscribe to timing service
    expect(timingService.subscribe).toHaveBeenCalled();

    // Should subscribe to key events
    expect(document.addEventListener).toHaveBeenCalled();
  });

  beforeEach(() => {
    videoService.isLoaded = true;
    videoPlayer = mockHTMLMediaElement as HTMLMediaElement;
    spyOn(videoPlayer, 'play');
    spyOn(videoPlayer, 'pause');
    const el = { nativeElement: videoPlayer } as ElementRef;
    videoService.setElement(el);
  });

  it('should play', () => {
    videoService.play();
    expect(videoPlayer.play).toHaveBeenCalled();
    expect(videoService.isPlaying).toBe(true);
  });

  it('should pause', () => {
    videoService.pause();
    expect(videoPlayer.pause).toHaveBeenCalled();
    expect(videoService.isPlaying).toBe(false);
  });

  it('should handle play on keyboard', () => {
    videoService.isPlaying = false;
    const spaceKeyUpEvent = new KeyboardEvent('keyup', {
      code: 'Space'
    });
    document.dispatchEvent(spaceKeyUpEvent);
    expect(videoPlayer.play).toHaveBeenCalled();
    expect(videoService.isPlaying).toBe(true);
  });

  it('should handle pause on keyboard', () => {
    videoService.isPlaying = true;
    const spaceKeyUpEvent = new KeyboardEvent('keyup', {
      code: 'Space'
    });
    document.dispatchEvent(spaceKeyUpEvent);
    expect(videoPlayer.pause).toHaveBeenCalled();
    expect(videoService.isPlaying).toBe(false);
  });
});
