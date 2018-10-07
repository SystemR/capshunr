import { Injectable } from '@angular/core';

export class Cue {
  start: number;
  end: number;
  text: string[] = [];
  prev: Cue = null;
  next: Cue = null;
  sanitize() {
    if (this.start) {
      this.start = parseFloat(this.start.toFixed(3));
    }

    if (this.end) {
      this.end = parseFloat(this.end.toFixed(3));
    }
  }
}

const LOCAL_STORAGE_KEY = 'SS';

@Injectable({
  providedIn: 'root'
})
export class SubtitleService {
  cues: Cue[] = [];
  cuesBySeconds: { [roundedTime: number]: Cue[] } = {};
  cueCache: Cue;

  // Initialized means the user has opened a subtitle file
  // or has added a subtitle manually
  isInitialized = false;

  constructor() {
    const prevCues = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (prevCues) {
      this.loadPrevious(prevCues);
    }
  }

  getCues(): Cue[] {
    return this.cues;
  }

  clearCues() {
    this.cues.length = 0;
    this.cueCache = null;
    this.cuesBySeconds = {};
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }

  parse(text) {
    this.clearCues();
    const cues = this.cues;

    const lines = text.split(/\r\n|\r|\n/);
    let currentCue: Cue = null;
    let prevCue: Cue = null;
    lines.forEach(line => {
      if (line.match('-->')) {
        if (currentCue) {
          cues.push(currentCue);
          currentCue = null;
        }
        const linesArray = line.split(' --> ');
        currentCue = new Cue();
        currentCue.start = this.toSeconds(linesArray[0]);
        currentCue.end = this.toSeconds(linesArray[1]);
        currentCue.text = [];
      } else if (currentCue) {
        if (line === '') {
          if (prevCue) {
            currentCue.prev = prevCue;
            prevCue.next = currentCue;
          }
          cues.push(currentCue);
          this.saveInIndex(currentCue);

          prevCue = currentCue;
          currentCue = null;
        } else {
          currentCue.text.push(line);
        }
      }
    });
    this.isInitialized = true;
    this.saveToLocalStorage();
    return cues;
  }

  getSerialized(): string {
    const cues = this.cues;
    let serialized = 'WEBVTT\n\n';
    const fromSeconds = this.fromSeconds;
    for (const cue of cues) {
      serialized += fromSeconds(cue.start) + ' --> ' + fromSeconds(cue.end) + '\n';

      for (const text of cue.text) {
        serialized += text + '\n';
      }
      serialized += '\n';
    }
    return serialized;
  }

  add(cue: Cue) {
    if (!this.isInitialized) {
      this.clearCues();
      this.isInitialized = true;
    }

    const cues = this.cues;
    if (cue.prev) {
      const index = cues.findIndex(entry => {
        return entry === cue.prev;
      });
      cues.splice(index + 1, 0, cue);
      cue.prev.next = cue;

      if (cue.next) {
        cue.next.prev = cue;
      }
    } else {
      cues.unshift(cue);
    }
    this.saveInIndex(cue);
    this.saveToLocalStorage();
  }

  findCueOnSecond(time: number, roundedSecond: number): Cue {
    if (this.cuesBySeconds[roundedSecond]) {
      const cuesOnThisSecond = this.cuesBySeconds[roundedSecond];
      for (let i = 0, len = cuesOnThisSecond.length; i < len; i++) {
        const cue = cuesOnThisSecond[i];
        if (time >= cue.start && time <= cue.end) {
          this.cueCache = cue;
          return cue;
        }
      }
    }

    return null;
  }

  getSubtitleAtTime(time: number): Cue {
    if (this.cueCache) {
      if (time >= this.cueCache.start && time <= this.cueCache.end) {
        return this.cueCache;
      } else {
        // look at immediate next
        const next = this.cueCache.next;
        if (next && time >= next.start && time <= next.end) {
          this.cueCache = next;
          return this.cueCache;
        }
      }
    }

    this.cueCache = null;

    // Search from roundedSecond
    let roundedSecond = Math.floor(time);
    while (roundedSecond >= 0) {
      const result = this.findCueOnSecond(time, roundedSecond);
      if (result) {
        return result;
      }
      roundedSecond--;
    }

    return null;
  }

  reIndex(cue: Cue, previousTime: number) {
    const roundedPreviousTime = Math.floor(previousTime);
    if (this.cuesBySeconds[roundedPreviousTime]) {
      const cuesOnThisSecond = this.cuesBySeconds[roundedPreviousTime];
      for (let i = 0, len = cuesOnThisSecond.length; i < len; i++) {
        const cuePtr = cuesOnThisSecond[i];
        if (cue === cuePtr) {
          cuesOnThisSecond.splice(i, 1);
        }
      }
    }
    this.saveInIndex(cue);
  }

  removeSubtitle(cue: Cue) {
    const roundedPreviousTime = Math.floor(cue.start);
    if (this.cuesBySeconds[roundedPreviousTime]) {
      const cuesOnThisSecond = this.cuesBySeconds[roundedPreviousTime];
      for (let i = 0, len = cuesOnThisSecond.length; i < len; i++) {
        const cuePtr = cuesOnThisSecond[i];
        if (cue === cuePtr) {
          cuesOnThisSecond.splice(i, 1);
        }
      }
    }

    const cues = this.cues;
    cues.splice(
      cues.findIndex(entry => {
        return entry === cue;
      }),
      1
    );
  }

  private loadPrevious(prevCues: string) {
    this.cues.length = 0;
    this.cueCache = null;
    const localStorageCues = JSON.parse(prevCues);
    let prevCue = null;
    for (const lsCue of localStorageCues) {
      const addCue = Object.assign(new Cue(), lsCue);
      if (prevCue) {
        prevCue.next = lsCue;
      }
      addCue.prev = prevCue;
      prevCue = addCue;
      this.cues.push(addCue);
      this.saveInIndex(addCue);
    }
    this.isInitialized = true;
  }

  private saveToLocalStorage() {
    if (this.isInitialized) {
      const jsonData = [];
      for (const cue of this.cues) {
        jsonData.push({
          start: cue.start,
          end: cue.end,
          text: cue.text
        });
      }
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jsonData));
    }
  }

  private saveInIndex(cue: Cue) {
    const roundedTime = Math.floor(cue.start);
    if (!this.cuesBySeconds[roundedTime]) {
      this.cuesBySeconds[roundedTime] = [];
    }
    this.cuesBySeconds[roundedTime].push(cue);
  }

  private toSeconds(time: string): number {
    time = time.replace(',', '.');
    const timeArray = time.split(':');
    const len = timeArray.length;
    const secondsPosition = timeArray.length - 1;

    let timeSeconds =
      parseInt(timeArray[secondsPosition - 1], 10) * 60 + parseFloat(timeArray[secondsPosition]);

    if (len >= 2) {
      timeSeconds += parseInt(timeArray[0], 10) * 3600;
    }

    return parseFloat(timeSeconds.toFixed(3));
  }

  private fromSeconds(time: number): string {
    const date = new Date(null);
    const seconds = Math.floor(time);
    const ms = time - seconds;
    date.setSeconds(seconds);
    date.setMilliseconds(parseFloat(ms.toPrecision(3)) * 1000);
    return date.toISOString().substr(11, 12);
  }
}
