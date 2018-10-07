import { Injectable } from '@angular/core';

import { Cue, SubtitleService } from './subtitle.service';

@Injectable({
  providedIn: 'root'
})
export class TutorialService {
  hasTutorial = false;
  cues: Cue[];

  constructor(private subtitleService: SubtitleService) {
    const cues = this.subtitleService.getCues();

    if (!cues.length) {
      this.addTutorialSubtitles(cues);
      this.hasTutorial = true;
      this.cues = cues;
    }
  }

  addTutorialSubtitles(cues: Cue[]) {
    const firstMsg = new Cue();
    firstMsg.start = 0.5;
    firstMsg.end = 2.5;
    const firstMsgText = firstMsg.text;
    firstMsgText.push('Welcome to Capshunr');
    firstMsgText.push('====================');
    firstMsgText.push('Capshunr is a tool to author WebVTT or SRT subtitle.');
    firstMsgText.push('You can import and export WebVTT or SRT subtitles from the menu at the top');

    cues.push(firstMsg);

    const secondMsg = new Cue();
    secondMsg.start = 2.75;
    secondMsg.end = 4;
    const secondMsgText = secondMsg.text;
    secondMsgText.push('Adding, editing, a subtitle cue is easy.');
    secondMsgText.push('To change the text of a cue,');
    secondMsgText.push("try doubleclicking on this cue's body");

    firstMsg.next = secondMsg;
    secondMsg.prev = firstMsg;
    cues.push(secondMsg);

    const thirdMsg = new Cue();
    thirdMsg.start = 4.25;
    thirdMsg.end = 5.25;
    const thirdMsgText = thirdMsg.text;
    thirdMsgText.push('^');
    thirdMsgText.push("|| You can change the cue's start time by dragging the header");

    secondMsg.next = thirdMsg;
    thirdMsg.prev = secondMsg;
    cues.push(thirdMsg);

    const fourthMsg = new Cue();
    fourthMsg.start = 5.5;
    fourthMsg.end = 6.75;
    const fourthMsgText = fourthMsg.text;
    fourthMsgText.push("|| You can change the cue's duration by");
    fourthMsgText.push('|| dragging the expander');
    fourthMsgText.push('v');

    thirdMsg.next = fourthMsg;
    fourthMsg.prev = thirdMsg;
    cues.push(fourthMsg);

    const fifthMsg = new Cue();
    fifthMsg.start = 7.25;
    fifthMsg.end = 8.25;
    const fifthMsgText = fifthMsg.text;
    fifthMsgText.push('Now try loading a video and start authoring its subtitle!');

    fourthMsg.next = fifthMsg;
    fifthMsg.prev = fourthMsg;
    cues.push(fifthMsg);
  }

  clearTutorial() {
    if (this.hasTutorial) {
      this.cues.length = 0;
      this.hasTutorial = false;
    }
  }
}
