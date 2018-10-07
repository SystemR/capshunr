import { Component, ViewChild } from '@angular/core';

import { config } from '../../app.config';
import { SubtitleService } from '../../services/subtitle.service';
import { TimingService } from '../../services/timing.service';
import { TutorialService } from '../../services/tutorial.service';
import { VideoService } from '../../services/video.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @ViewChild('videoInput') videoInput;
  @ViewChild('subtitleInput') subtitleInput;
  @ViewChild('subtitleSave') subtitleSave;

  videoFileName: string;

  constructor(
    private videoService: VideoService,
    private subtitleService: SubtitleService,
    private timingService: TimingService,
    private tutorialService: TutorialService
  ) {}

  chooseVideo() {
    this.videoInput.nativeElement.click();
  }

  chooseSubtitle() {
    this.subtitleInput.nativeElement.click();
  }

  chooseFileSave() {
    const text = this.subtitleService.getSerialized();
    const exportLink = document.createElement('a');
    exportLink.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    let fileName = 'subtitle.vtt';
    if (this.videoFileName) {
      const fileNameArray = this.videoFileName.split('.');
      fileNameArray.pop();
      fileNameArray.push('.vtt');
      fileName = fileNameArray.join('.');
    }
    exportLink.setAttribute('download', fileName);
    exportLink.click();
  }

  loadVideo($event) {
    this.tutorialService.clearTutorial();
    const file = $event.target.files[0];
    this.videoFileName = file.name;
    this.videoService.load(file);
  }

  loadSubtitle($event) {
    const file = $event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.tutorialService.clearTutorial();
      const cues = this.subtitleService.parse(reader.result);
      if (
        !this.videoService.isLoaded &&
        (cues.length &&
          cues[cues.length - 1].end > config.TIMELINE_NUMS_ON_START / config.MULTIPLIER)
      ) {
        this.timingService.setDuration(
          cues[cues.length - 1].end + config.TIMELINE_NUMS_DURATION_EXTRA
        );
      }

      // Reset the form
      this.subtitleInput.nativeElement.value = null;
    };
    reader.readAsText(file, 'utf8');
  }
}
